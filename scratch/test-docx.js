// Quick test: generate a docx locally to confirm the package works
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, Table, TableRow, TableCell, WidthType,
  Header, Footer, PageNumber
} = require('docx')
const fs = require('fs')
const path = require('path')

async function test() {
  const doc = new Document({
    sections: [{
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'GSTAT e-Learning Platform  |  Maths', size: 18, color: '888888' })],
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
        new Paragraph({
          children: [new TextRun({ text: '🔢  Counting 1 to 5', size: 52, bold: true, color: '1a1a2e' })],
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'MATHS WORKSHEET', size: 22, color: '888888', allCaps: true })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        // Student info table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Student Name: ___________________________', size: 24 })] })],
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Date: ______________', size: 24 })] })],
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Score: ______', size: 24 })] })],
                  width: { size: 20, type: WidthType.PERCENTAGE },
                  borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ children: [new TextRun({ text: '─'.repeat(70), color: 'CCCCCC', size: 20 })], spacing: { before: 200, after: 400 } }),

        // Activities
        new Paragraph({ children: [new TextRun({ text: '📋 Instructions:', size: 26, bold: true })], spacing: { after: 150 } }),
        new Paragraph({ children: [new TextRun({ text: 'Count each group of objects and write the number in the box!', size: 24, italics: true, color: '555555' })], spacing: { after: 400 } }),

        ...[ 
          { emoji: '🍎', count: 1, word: 'one' },
          { emoji: '🌟', count: 2, word: 'two' },
          { emoji: '🐶', count: 3, word: 'three' },
          { emoji: '🏠', count: 4, word: 'four' },
          { emoji: '🌈', count: 5, word: 'five' },
        ].flatMap(item => [
          new Paragraph({
            children: [
              new TextRun({ text: `${item.emoji.repeat(item.count)}   →   [ ${item.count} ]   (${item.word})`, size: 28 }),
            ],
            spacing: { before: 200, after: 100 },
            border: { bottom: { style: BorderStyle.DASHED, size: 6, color: 'CCCCCC' } }
          }),
        ]),

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
  const outPath = path.join(__dirname, 'test_worksheet.docx')
  fs.writeFileSync(outPath, buffer)
  console.log('✅ Worksheet generated successfully:', outPath)
  console.log('File size:', buffer.length, 'bytes')
}

test().catch(console.error)
