import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, Table, TableRow, TableCell, WidthType,
  Header, Footer, PageNumber
} from 'docx'

async function getWorksheet(id: string) {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('worksheets')
    .select('*, subject:subjects(name, slug)')
    .eq('id', id)
    .single()
  return data
}

function getMathCountingContent() {
  const items = [
    { emoji: '🍎', count: 1, word: 'one' },
    { emoji: '🌟', count: 2, word: 'two' },
    { emoji: '🐶', count: 3, word: 'three' },
    { emoji: '🏠', count: 4, word: 'four' },
    { emoji: '🌈', count: 5, word: 'five' },
  ]
  return items.flatMap(item => [
    new Paragraph({
      children: [
        new TextRun({ text: `${item.emoji.repeat(item.count)}   →   [ ${item.count} ]   (${item.word})`, size: 28 }),
      ],
      spacing: { before: 200, after: 100 },
      border: { bottom: { style: BorderStyle.DASHED, size: 6, color: 'CCCCCC' } }
    }),
  ])
}

function getMathAdditionContent() {
  const problems = [
    { a: 1, b: 1 }, { a: 2, b: 1 }, { a: 1, b: 3 }, { a: 2, b: 2 },
    { a: 3, b: 1 }, { a: 1, b: 4 }, { a: 2, b: 3 }, { a: 4, b: 1 },
  ]
  return problems.map((p, i) => new Paragraph({
    children: [
      new TextRun({ text: `${i + 1}.   ${p.a}  +  ${p.b}  =  ____`, size: 28, bold: i % 2 === 0 }),
    ],
    spacing: { before: 200, after: 100 },
  }))
}

function getEnglishAlphabetContent() {
  const letters = ['A','B','C','D','E','F','G','H','I','J']
  return letters.flatMap(letter => [
    new Paragraph({
      children: [
        new TextRun({ text: `${letter}  ${letter.toLowerCase()}   `, size: 48, bold: true }),
        new TextRun({ text: '  Trace:  _ _ _ _ _ _ _ _ _ _', size: 28, color: 'AAAAAA' }),
      ],
      spacing: { before: 200, after: 100 },
    }),
  ])
}

function getEnglishWordsContent() {
  const words = [
    { word: 'CAT', hint: 'A fluffy pet 🐱' },
    { word: 'DOG', hint: 'A loyal pet 🐶' },
    { word: 'SUN', hint: 'Shines in the sky ☀️' },
    { word: 'TREE', hint: 'Has leaves and branches 🌳' },
    { word: 'BALL', hint: 'Round and bouncy ⚽' },
  ]
  return words.map((item, i) => new Paragraph({
    children: [
      new TextRun({ text: `${i + 1}.  ${item.word}`, size: 28, bold: true }),
      new TextRun({ text: `   →   ${item.hint}`, size: 24, color: '666666' }),
    ],
    spacing: { before: 200, after: 100 },
  }))
}

function getScienceContent() {
  const items = [
    { label: 'Plant 🌱', fact: 'Plants need sun and water to grow.' },
    { label: 'Earth 🌍', fact: 'Our planet is covered mostly in water.' },
    { label: 'Rain 🌧️', fact: 'Water falls from clouds as rain.' },
    { label: 'Sun ☀️', fact: 'The sun gives us light and warmth.' },
    { label: 'Butterfly 🦋', fact: 'Butterflies start life as caterpillars.' },
    { label: 'Bee 🐝', fact: 'Bees make honey and help flowers grow.' },
  ]
  return items.flatMap((item, i) => [
    new Paragraph({
      children: [
        new TextRun({ text: `${i + 1}. ${item.label}:  `, size: 26, bold: true }),
        new TextRun({ text: item.fact, size: 24 }),
      ],
      spacing: { before: 200, after: 50 },
    }),
    new Paragraph({
      children: [new TextRun({ text: '   Draw here: ___________________', size: 22, color: 'AAAAAA' })],
      spacing: { after: 100 },
    }),
  ])
}

function getCodingContent() {
  const steps = [
    '1. START  →  Position the robot at the beginning',
    '2. MOVE RIGHT  →  Go one step to the right',
    '3. MOVE UP  →  Go one step up',
    '4. MOVE RIGHT  →  Go one step to the right',
    '5. FINISH ⭐  →  You reached the star!',
  ]
  return [
    new Paragraph({ children: [new TextRun({ text: 'Help the robot follow the steps below:', size: 26, italics: true, color: '555555' })], spacing: { after: 200 } }),
    ...steps.map(step => new Paragraph({
      children: [new TextRun({ text: step, size: 26 })],
      spacing: { before: 150, after: 100 },
      border: { left: { style: BorderStyle.SINGLE, size: 12, color: '22C55E' } },
      indent: { left: 200 },
    })),
    new Paragraph({ children: [new TextRun({ text: '\n\nDraw the robot\'s path on a grid below:', size: 24, bold: true })], spacing: { before: 300 } }),
    ...Array.from({ length: 5 }).map(() => new Paragraph({
      children: [new TextRun({ text: '[ ]  [ ]  [ ]  [ ]  [ ]  [ ]', size: 24, color: 'DDDDDD' })],
      spacing: { before: 80 },
    })),
  ]
}

function getWorksheetBody(worksheet: any): Paragraph[] {
  const slug = worksheet.subject?.slug || ''
  const title = worksheet.title.toLowerCase()

  if (slug.includes('math') || slug.includes('maths')) {
    if (title.includes('count') || title.includes('number')) return getMathCountingContent()
    if (title.includes('addition') || title.includes('add')) return getMathAdditionContent()
    return getMathCountingContent()
  }
  if (slug.includes('english')) {
    if (title.includes('alphabet') || title.includes('tracing')) return getEnglishAlphabetContent()
    return getEnglishWordsContent()
  }
  if (slug.includes('science')) return getScienceContent()
  if (slug.includes('coding')) return getCodingContent()

  // Generic fallback
  return Array.from({ length: 5 }, (_, i) => new Paragraph({
    children: [new TextRun({ text: `Question ${i + 1}: ________________________________`, size: 26 })],
    spacing: { before: 300, after: 100 },
  }))
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const worksheet = await getWorksheet(params.id)
    if (!worksheet) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (worksheet.is_premium) {
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 })
    }

    const slug = worksheet.subject?.slug || 'general'
    const subjectEmoji = slug.includes('math') ? '🔢' : slug.includes('english') ? '📖' : slug.includes('science') ? '🔬' : slug.includes('coding') ? '💻' : '📝'

    const doc = new Document({
      sections: [{
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `GSTAT e-Learning Platform  |  ${worksheet.subject?.name || 'Worksheet'}`, size: 18, color: '888888' }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Keep learning, keep growing! ⭐⭐⭐⭐⭐     Page ', size: 18, color: '888888' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888' }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: [
          // Title block
          new Paragraph({
            children: [new TextRun({ text: `${subjectEmoji}  ${worksheet.title}`, size: 52, bold: true, color: '1a1a2e' })],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: worksheet.subject?.name?.toUpperCase() + ' WORKSHEET', size: 22, color: '888888', allCaps: true })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          ...(worksheet.description ? [new Paragraph({
            children: [new TextRun({ text: worksheet.description, size: 24, color: '555555', italics: true })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })] : []),

          // Student info table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Student Name: ___________________________', size: 24 })] })], width: { size: 50, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Date: ______________', size: 24 })] })], width: { size: 30, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Score: ______', size: 24 })] })], width: { size: 20, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
                ],
              }),
            ],
          }),

          // Divider
          new Paragraph({ children: [new TextRun({ text: '─'.repeat(70), color: 'CCCCCC', size: 20 })], spacing: { before: 200, after: 400 } }),

          // Instructions
          new Paragraph({
            children: [new TextRun({ text: '📋 Instructions:', size: 26, bold: true })],
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [new TextRun({
              text: slug.includes('math') ? 'Complete each activity carefully. Write or circle your answer.'
                : slug.includes('english') ? 'Trace and write each letter/word neatly. Take your time!'
                : slug.includes('science') ? 'Read each fact and draw or write your answer in the space provided.'
                : slug.includes('coding') ? 'Follow the steps to help the robot reach the finish!'
                : 'Read each question and write your best answer.',
              size: 24, italics: true, color: '555555'
            })],
            spacing: { after: 400 },
          }),

          // Activity content
          ...getWorksheetBody(worksheet),

          // End reward section
          new Paragraph({ children: [new TextRun({ text: ' ', size: 24 })], spacing: { before: 400 } }),
          new Paragraph({
            children: [new TextRun({ text: '🌟 Great Job! Colour a star for each question you completed!', size: 26, bold: true, color: 'D97706' })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '⭐  ⭐  ⭐  ⭐  ⭐', size: 36 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
          }),
        ],
      }],
    })

    const buffer = await Packer.toBuffer(doc)

    const safeTitle = worksheet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${safeTitle}.docx"`,
        'Content-Length': String(buffer.length),
      },
    })
  } catch (error) {
    console.error('[v0] Error generating worksheet:', error)
    return NextResponse.json({ error: 'Failed to generate worksheet' }, { status: 500 })
  }
}
