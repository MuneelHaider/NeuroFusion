import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, location, message, requestAccess } = await request.json();

    // Validate required fields
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: 'Full name, email and message are required' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Add this to your .env file
        pass: process.env.EMAIL_PASS, // Add this to your .env file
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ['muneelhaider@gmail.com', 'khawajamurad@outlook.com'],
      subject: `NeuroFusion Interest - ${requestAccess ? 'ACCESS REQUESTED' : 'General Inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
          <div style="background-color: #3b82f6; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New NeuroFusion Interest</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone is interested in joining your project!</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px;">
            <div style="margin-bottom: 20px;">
              <h2 style="color: #1f2937; margin-bottom: 15px;">Contact Information</h2>
              <p style="margin: 8px 0; color: #374151;"><strong>Full Name:</strong> ${fullName}</p>
              <p style="margin: 8px 0; color: #374151;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 8px 0; color: #374151;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p style="margin: 8px 0; color: #374151;"><strong>Location:</strong> ${location || 'Not provided'}</p>
              <p style="margin: 8px 0; color: #374151;"><strong>Request Access:</strong> <span style="color: ${requestAccess ? '#10b981' : '#ef4444'}; font-weight: bold;">${requestAccess ? 'YES' : 'NO'}</span></p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #1f2937; margin-bottom: 10px;">Their Message</h3>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0; color: #374151; line-height: 1.6;">${message}</p>
              </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">This message was sent from the NeuroFusion contact form.</p>
              <p style="margin: 5px 0 0 0;">Timestamp: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
