import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import fsSync from 'fs'
import path from 'path'
import os from 'os'
import { spawn } from 'child_process'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type InferenceResult = {
  diagnosis: string
  tumorLocation: string
  tumorSize: string
  confidence: number
  severity: string
  recommendations: string[]
}

async function writeTempFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'neurofusion-'))
  const filePath = path.join(tmpDir, file.name)
  await fs.writeFile(filePath, buffer)
  return filePath
}

function runPython(modelPath: string, inputPath: string): Promise<InferenceResult> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'utils', 'inference', 'infer.py')
    const venvPython = path.join(process.cwd(), '.venv', process.platform === 'win32' ? 'Scripts' : 'bin', process.platform === 'win32' ? 'python.exe' : 'python')
    const pythonBin = fsSync.existsSync(venvPython) ? venvPython : (process.env.PYTHON_BIN || 'python3')
    const py = spawn(pythonBin, [scriptPath, '--model', modelPath, '--input', inputPath], {
      cwd: process.cwd(),
      env: { ...process.env },
    })

    let stdout = ''
    let stderr = ''

    py.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    py.stderr.on('data', (data) => {
      stderr += data.toString()
    })
    py.on('error', (err) => reject(err))
    py.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python exited with code ${code}: ${stderr}`))
      }
      try {
        const json = JSON.parse(stdout)
        resolve(json)
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${e}\nOutput: ${stdout}\nError: ${stderr}`))
      }
    })
  })
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'Missing file field' }, { status: 400 })
    }
    const filename = (file as File).name.toLowerCase()
    if (!filename.endsWith('.nii') && !filename.endsWith('.nii.gz')) {
      return NextResponse.json({ error: 'Only .nii or .nii.gz files are supported' }, { status: 400 })
    }

    const inputPath = await writeTempFile(file)
    const modelPath = path.join(process.cwd(), 'models', 'segformer3d.pth')

    const result = await runPython(modelPath, inputPath)

    return NextResponse.json({ ok: true, result })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Inference failed' }, { status: 500 })
  }
}


