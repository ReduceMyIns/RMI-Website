import type { ParsedCertificateData } from '../../types/compliance.ts';

export const coiParsingService = {
  /**
   * Mocks the OCR and document understanding process.
   * In the future, this will integrate with Google Document AI.
   * @param fileBuffer The raw file data (PDF/JPEG/PNG)
   * @returns ParsedCertificateData
   */
  async parseCOI(fileBuffer: Buffer): Promise<ParsedCertificateData> {
    // TODO: Integrate with Google Document AI here
    // const document = await googleDocumentAI.process(fileBuffer);
    // return mapDocumentToParsedData(document);

    console.log('Mocking COI parsing...');
    
    // Deterministic Mock Logic:
    // If buffer length is even -> Compliant
    // If buffer length is odd -> Non-Compliant (Missing AI, Low Limits)
    const isCompliant = fileBuffer.length % 2 === 0;

    if (isCompliant) {
      return {
        namedInsured: 'Acme Corp',
        carriers: ['Travelers', 'Hartford'],
        policies: [
          {
            type: 'GL',
            policyNumber: 'GL-123456789',
            effectiveDate: new Date().toISOString(),
            expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            limits: {
              perOccurrence: 1000000,
              aggregate: 2000000,
            }
          }
        ],
        endorsements: {
          additionalInsured: true,
          waiverOfSubrogation: false,
        }
      };
    } else {
      // Non-Compliant Response
      return {
        namedInsured: 'Acme Corp',
        carriers: ['Unknown Carrier'],
        policies: [
          {
            type: 'GL',
            policyNumber: 'GL-FAIL-123',
            effectiveDate: new Date().toISOString(),
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            limits: {
              perOccurrence: 500000, // Too low
              aggregate: 1000000, // Too low
            }
          }
        ],
        endorsements: {
          additionalInsured: false, // Missing AI
          waiverOfSubrogation: false,
        }
      };
    }
  }
};
