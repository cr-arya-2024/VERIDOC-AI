import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
    try {
        // --- 0. Validate environment ---
        const geminiKey = process.env.GEMINI_API_KEY;

        if (!geminiKey) {
            console.error('Missing Gemini API Key');
            return NextResponse.json(
                {
                    error: 'Missing environment variables',
                    details: 'Check GEMINI_API_KEY',
                },
                { status: 500 }
            );
        }

        // Initialize Gemini client after validation
        const genAI = new GoogleGenAI({ apiKey: geminiKey });

        // --- 1. Parse form data ---
        console.log('Step 1: Parsing form data');
        let formData: FormData;
        try {
            formData = await request.formData();
        } catch (error: unknown) {
            const parseError = error as Error;
            console.error('FormData parsing error:', parseError);
            return NextResponse.json(
                {
                    error: 'Failed to parse request',
                    details: parseError?.message,
                },
                { status: 400 }
            );
        }

        const file = formData.get('file') as File | null;
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }
        console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);

        const code_content = await file.text();
        const file_name = file.name;

        // --- 2. Call Gemini ---
        console.log('Step 2: Calling Gemini API');
        let analysis_result = '';
        try {
            const prompt = `Analyze this Verilog code and provide:
1.Provide the analysis in plain text only. Do not use Markdown formatting such as asterisks (**), hashtags (#), backticks (\`), or underscores. Use simple capitalization for headers and standard dashes for lists. 
2.Code quality assessment
3. Potential bugs or errors
4. Optimization suggestions
5. Synthesis warnings
6. Best practices violations

Verilog Code:
${code_content}`;

            const response = await genAI.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });

            analysis_result = response.text || '';
            if (!analysis_result) {
                throw new Error('No analysis text received from AI');
            }
            console.log('Gemini analysis completed successfully');
        } catch (error: unknown) {
            const aiError = error as Error;
            console.error('Gemini API error:', aiError);
            return NextResponse.json(
                {
                    error: 'AI analysis failed',
                    details: aiError?.message || 'Unknown AI error',
                },
                { status: 502 }
            );
        }

        // --- 3. Save to Supabase ---
        console.log('Step 3: Saving to Supabase');
        const isUsingServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        console.log(`Bypass RLS active: ${isUsingServiceKey}`);

        const { data, error } = await supabaseAdmin
            .from('verilog_analyses')
            .insert([
                {
                    file_name,
                    code_content,
                    analysis_result: { analysis: analysis_result },
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                {
                    error: 'Failed to save analysis',
                    details: error.message,
                },
                { status: 500 }
            );
        }

        console.log(`Analysis saved successfully with ID: ${data.id}`);

        // --- 4. Respond to client ---
        return NextResponse.json({
            success: true,
            data: {
                id: data.id,
                file_name: data.file_name,
                analysis: analysis_result,
                created_at: data.created_at,
            },
        });
    } catch (error: unknown) {
        const err = error as Error;
        console.error('=== ANALYSIS ERROR (UNCAUGHT) ===');
        console.error('Error name:', err?.name);
        console.error('Error message:', err?.message);
        console.error('Error stack:', err?.stack);
        console.error('Full error object (safe):', {
            name: err?.name,
            message: err?.message,
        });
        console.error('=================================');

        return NextResponse.json(
            {
                error: 'Failed to analyze code',
                details: err?.message || String(err),
            },
            { status: 500 }
        );
    }
}
