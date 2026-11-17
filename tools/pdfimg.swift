import PDFKit
import AppKit
let d = PDFDocument(url: URL(fileURLWithPath: CommandLine.arguments[1]))!
for i in 0..<d.pageCount {
  let p = d.page(at: i)!; let b = p.bounds(for: .mediaBox); let s: CGFloat = 1.6
  let img = p.thumbnail(of: NSSize(width: b.width*s, height: b.height*s), for: .mediaBox)
  let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: CommandLine.arguments[2] + "/page\(i+1).png"))
}
