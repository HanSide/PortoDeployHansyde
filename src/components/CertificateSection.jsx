import { useState } from "react";
import certData from "../data/certificates.json"; // Import JSON-nya

export default function CertificateSection() {
  const [hoveredId, setHoveredId] = useState(null);
  
  // Ambil array certificates dari JSON
  const CERTIFICATES = certData.certificates;

  return (
    <div className="cert-metaphor-layout">
      <div className="cert-header">
        <span>AUTHORIZATION RECORDS //</span>
        <h3>CERTIFICATIONS</h3>
      </div>
      
      <div className="cert-bento-grid">
        {CERTIFICATES.map((cert, index) => {
          const isHovered = hoveredId === cert.id;
          const rankNum = String(index + 1).padStart(2, "0");
          
          return (
            <a
              key={cert.id}
              href={cert.url}
              target="_blank"
              rel="noreferrer"
              className={`cert-item ${isHovered ? "is-active" : ""}`}
              onMouseEnter={() => setHoveredId(cert.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {isHovered && <div className="cert-item__brush" />}
              
              <div className="cert-item__content">
                <div className="cert-item__image-wrap">
                  <img src={cert.image} alt={cert.title} className="cert-item__img" />
                  <div className="cert-item__scanline" aria-hidden="true" />
                </div>

                <div className="cert-item__top">
                  <span className="cert-item__index">{rankNum}</span>
                  <span className="cert-item__year">{cert.year}</span>
                </div>
                
                <h4 className="cert-item__title">{cert.title}</h4>
                <span className="cert-item__issuer">{cert.issuer}</span>
                
                <span className="cert-item__status" aria-hidden="true">
                  {cert.status} //
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}