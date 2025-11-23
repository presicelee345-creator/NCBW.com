import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CertificateGeneratorProps {
  traineeName: string;
  trackName: string;
  completionDate: string;
  showCustomization?: boolean;
}

export function CertificateGenerator({ traineeName, trackName, completionDate, showCustomization = false }: CertificateGeneratorProps) {
  const [template, setTemplate] = useState<string>("standard");
  const [signature1Name, setSignature1Name] = useState("Administrator Signature");
  const [signature2Name, setSignature2Name] = useState("Chapter President");

  const templates = {
    standard: {
      name: "Standard",
      borderColor: "#c6930a",
      borderWidth: "20px",
      backgroundColor: "white"
    },
    elegant: {
      name: "Elegant",
      borderColor: "#000000",
      borderWidth: "15px",
      backgroundColor: "#fefbf3"
    },
    modern: {
      name: "Modern",
      borderColor: "#c6930a",
      borderWidth: "10px",
      backgroundColor: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)"
    },
    classic: {
      name: "Classic",
      borderColor: "#8b7355",
      borderWidth: "25px",
      backgroundColor: "#fffef8"
    }
  };

  const getTemplateStyles = (templateKey: string) => {
    const t = templates[templateKey as keyof typeof templates];
    return `
      .certificate {
        background: ${t.backgroundColor};
        border: ${t.borderWidth} solid ${t.borderColor};
        border-radius: 10px;
        padding: 60px;
        max-width: 900px;
        width: 100%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(198, 147, 10, 0.3);
        position: relative;
      }
      .certificate::before {
        content: '';
        position: absolute;
        top: 30px;
        left: 30px;
        right: 30px;
        bottom: 30px;
        border: 2px solid ${t.borderColor};
        border-radius: 5px;
      }
    `;
  };

  const generateCertificate = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) return;

    const certificateHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate of Completion</title>
          <style>
            @page {
              size: letter landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 40px;
              font-family: 'Georgia', serif;
              background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
              color: #000;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            ${getTemplateStyles(template)}
            .logo {
              font-size: 60px;
              margin-bottom: 10px;
            }
            .org-name {
              font-size: 24px;
              color: #c6930a;
              font-weight: bold;
              margin-bottom: 5px;
              letter-spacing: 2px;
            }
            .chapter {
              font-size: 16px;
              color: #666;
              margin-bottom: 30px;
            }
            .certificate-title {
              font-size: 42px;
              color: #c6930a;
              margin-bottom: 20px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 3px;
            }
            .awarded-to {
              font-size: 18px;
              color: #666;
              margin-bottom: 15px;
              font-style: italic;
            }
            .trainee-name {
              font-size: 36px;
              color: #000;
              margin-bottom: 30px;
              font-weight: bold;
              text-decoration: underline;
              text-decoration-color: #c6930a;
              text-decoration-thickness: 2px;
              text-underline-offset: 8px;
            }
            .completion-text {
              font-size: 16px;
              color: #666;
              margin-bottom: 10px;
              line-height: 1.6;
            }
            .track-name {
              font-size: 22px;
              color: #c6930a;
              margin-bottom: 30px;
              font-weight: bold;
            }
            .date {
              font-size: 16px;
              color: #666;
              margin-top: 40px;
              margin-bottom: 40px;
            }
            .signature-section {
              display: flex;
              justify-content: space-around;
              margin-top: 50px;
              gap: 40px;
            }
            .signature-line {
              flex: 1;
              border-top: 2px solid #000;
              padding-top: 10px;
            }
            .signature-label {
              font-size: 14px;
              color: #666;
              margin-top: 5px;
            }
            @media print {
              body {
                background: white;
              }
              .certificate {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="logo">👑</div>
            <div class="org-name">NATIONAL COALITION OF 100 BLACK WOMEN</div>
            <div class="chapter">Queen City Metropolitan Chapter</div>
            
            <div class="certificate-title">Certificate of Completion</div>
            
            <div class="awarded-to">This certificate is proudly presented to</div>
            
            <div class="trainee-name">${traineeName}</div>
            
            <div class="completion-text">
              For successfully completing the comprehensive leadership training program
            </div>
            
            <div class="track-name">${trackName}</div>
            
            <div class="completion-text">
              Demonstrating dedication, knowledge, and commitment to excellence in leadership development
            </div>
            
            <div class="date">Date of Completion: ${completionDate}</div>
            
            <div class="signature-section">
              <div class="signature-line">
                <div class="signature-label">${signature1Name}</div>
              </div>
              <div class="signature-line">
                <div class="signature-label">${signature2Name}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(certificateHTML);
    printWindow.document.close();

    // Wait for the content to load, then trigger print dialog
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  if (showCustomization) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Certificate Template</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(templates).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>First Signature Name</Label>
            <Input 
              value={signature1Name} 
              onChange={(e) => setSignature1Name(e.target.value)}
              placeholder="e.g., Administrator Signature"
            />
          </div>

          <div className="space-y-2">
            <Label>Second Signature Name</Label>
            <Input 
              value={signature2Name} 
              onChange={(e) => setSignature2Name(e.target.value)}
              placeholder="e.g., Chapter President"
            />
          </div>
        </div>

        <Button
          onClick={generateCertificate}
          className="bg-[#c6930a] hover:bg-[#a37808] gap-2"
        >
          <Download className="h-4 w-4" />
          Preview & Download Certificate
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={generateCertificate}
      className="bg-[#c6930a] hover:bg-[#a37808] gap-2"
    >
      <Download className="h-4 w-4" />
      Download Certificate
    </Button>
  );
}