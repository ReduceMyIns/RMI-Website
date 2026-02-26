import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AGENCY_INFO = {
  name: "ReduceMyInsurance.Net",
  address: "1500 Medical Center Pkwy STE 3-A-26",
  cityStateZip: "Murfreesboro, TN 37129",
  phone: "(615) 900-0288",
  email: "service@ReduceMyInsurance.Net",
  website: "www.ReduceMyInsurance.Net"
};

export const generateDecPage = (policy: any, details: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(18);
  doc.text("DECLARATION PAGE", pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(AGENCY_INFO.name, 14, 30);
  doc.setFontSize(10);
  doc.text(AGENCY_INFO.address, 14, 35);
  doc.text(AGENCY_INFO.cityStateZip, 14, 40);
  doc.text(`Phone: ${AGENCY_INFO.phone}`, 14, 45);
  doc.text(`Email: ${AGENCY_INFO.email}`, 14, 50);

  // Policy Info
  doc.setFontSize(12);
  doc.text("Policy Information", 14, 65);
  doc.line(14, 67, 100, 67);
  
  doc.setFontSize(10);
  doc.text(`Policy Number: ${policy.number}`, 14, 75);
  doc.text(`Carrier: ${policy.carrierName}`, 14, 80);
  doc.text(`Effective Date: ${new Date(policy.effectiveDate).toLocaleDateString()}`, 14, 85);
  doc.text(`Expiration Date: ${new Date(policy.expirationDate).toLocaleDateString()}`, 14, 90);
  doc.text(`Total Premium: $${policy.totalPremium?.toFixed(2)}`, 14, 95);

  let yPos = 110;

  // Coverages
  const coverages: any[] = [];
  
  // Check for main coverages
  if (details.coverages && details.coverages.length > 0) {
      details.coverages.forEach((group: any) => {
          Object.keys(group).forEach(key => {
              if (Array.isArray(group[key])) {
                  group[key].forEach((c: any) => {
                      coverages.push([
                          c.coverageDescriptionFirst || c.name || key,
                          c.limitAmountFirst || c.limit || c.limitFormatted || 'Included',
                          c.deductible || c.deductibleAmountFirst || '-'
                      ]);
                  });
              }
          });
      });
  } 
  // Fallback to vehicle policy level coverages
  else if (details.vehicles && details.vehicles.length > 0 && details.vehicles[0].policyLevelCoverages) {
      details.vehicles[0].policyLevelCoverages.forEach((c: any) => {
          coverages.push([
              c.name,
              c.limitFormatted || 'Included',
              c.deductiblesFormatted || '-'
          ]);
      });
  }
  // Fallback for Homeowners: Parse XML from properties if available
  else if (details.properties && details.properties.length > 0 && details.properties[0].coveragesXML) {
      const xml = details.properties[0].coveragesXML;
      // Simple regex to extract CoverageCd and Limit
      // Matches <CoverageCd>CODE</CoverageCd> ... <FormatInteger>LIMIT</FormatInteger>
      // This is a rough parser for the specific XML format provided
      const coverageRegex = /<CoverageCd>(.*?)<\/CoverageCd>.*?<FormatInteger>(.*?)<\/FormatInteger>/gs;
      let match;
      while ((match = coverageRegex.exec(xml)) !== null) {
          const code = match[1];
          const limit = match[2];
          
          // Map common codes to descriptions
          let desc = code;
          if (code === 'DWELL') desc = 'Dwelling';
          if (code === 'OS') desc = 'Other Structures';
          if (code === 'PP') desc = 'Personal Property';
          if (code === 'LOU') desc = 'Loss of Use';
          if (code === 'PL') desc = 'Personal Liability';
          if (code === 'MED') desc = 'Medical Payments';

          coverages.push([
              desc,
              `$${parseInt(limit).toLocaleString()}`,
              '-' // Deductible might be separate
          ]);
      }
      
      // Try to find deductible separately if possible, or just list it as N/A for now
      // The XML structure for deductible wasn't fully provided in the snippet, so we'll stick to limits.
  }

  if (coverages.length > 0) {
      doc.setFontSize(12);
      doc.text("Coverages", 14, yPos);
      autoTable(doc, {
          startY: yPos + 5,
          head: [['Coverage', 'Limit', 'Deductible']],
          body: coverages,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] }
      });
      yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Vehicles
  if (details.vehicles && details.vehicles.length > 0) {
      doc.setFontSize(12);
      doc.text("Insured Vehicles", 14, yPos);
      
      const vehicleData = details.vehicles.map((v: any) => [
          v.year,
          v.make,
          v.model,
          v.vin || 'N/A'
      ]);

      autoTable(doc, {
          startY: yPos + 5,
          head: [['Year', 'Make', 'Model', 'VIN']],
          body: vehicleData,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] }
      });
      yPos = (doc as any).lastAutoTable.finalY + 15;

      // Vehicle Specific Coverages (if any)
      details.vehicles.forEach((v: any) => {
          if (v.vehicleSpecificCoverages && v.vehicleSpecificCoverages.length > 0) {
               if (yPos > 250) { doc.addPage(); yPos = 20; }
               doc.setFontSize(10);
               doc.text(`Coverages for ${v.year} ${v.make} ${v.model}`, 14, yPos);
               
               const vCoverages = v.vehicleSpecificCoverages.map((c: any) => [
                   c.name || c.coverageDesc,
                   c.limitFormatted || 'Included',
                   c.deductiblesFormatted || '-'
               ]);

               autoTable(doc, {
                   startY: yPos + 5,
                   head: [['Coverage', 'Limit', 'Deductible']],
                   body: vCoverages,
                   theme: 'plain',
                   styles: { fontSize: 8 }
               });
               yPos = (doc as any).lastAutoTable.finalY + 10;
          }
      });
  }

  // Drivers
  if (details.drivers && details.drivers.length > 0) {
      if (yPos > 250) { doc.addPage(); yPos = 20; }
      doc.setFontSize(12);
      doc.text("Drivers", 14, yPos);
      
      const driverData = details.drivers.map((d: any) => [
          d.firstName,
          d.lastName,
          d.dlNumber || 'Pending'
      ]);

      autoTable(doc, {
          startY: yPos + 5,
          head: [['First Name', 'Last Name', 'License Number']],
          body: driverData,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] }
      });
      yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Properties & Lienholders
  if (details.properties && details.properties.length > 0) {
      if (yPos > 250) { doc.addPage(); yPos = 20; }
      doc.setFontSize(12);
      doc.text("Properties", 14, yPos);
      
      const propertyData = details.properties.map((p: any) => [
          p.addressLine1,
          p.city,
          p.state,
          p.zipCode
      ]);

      autoTable(doc, {
          startY: yPos + 5,
          head: [['Address', 'City', 'State', 'Zip']],
          body: propertyData,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] }
      });
      yPos = (doc as any).lastAutoTable.finalY + 15;

      // Lienholders
      details.properties.forEach((p: any) => {
          if (p.lienHolders && p.lienHolders.length > 0) {
              if (yPos > 250) { doc.addPage(); yPos = 20; }
              doc.setFontSize(10);
              doc.text(`Lienholders / Mortgagees for ${p.addressLine1}`, 14, yPos);
              
              const lienData = p.lienHolders.map((l: any) => [
                  l.name || 'Unknown',
                  l.address || '-',
                  l.loanNumber || '-'
              ]);

              autoTable(doc, {
                  startY: yPos + 5,
                  head: [['Name', 'Address', 'Loan Number']],
                  body: lienData,
                  theme: 'plain',
                  styles: { fontSize: 8 }
              });
              yPos = (doc as any).lastAutoTable.finalY + 10;
          }
      });
  }

  doc.save(`Dec_Page_${policy.number}.pdf`);
};

export const generateAutoIdCard = (policy: any, details: any) => {
  const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 55] // Credit card size approx
  });

  if (!details.vehicles || details.vehicles.length === 0) {
      alert("No vehicles found for ID card generation.");
      return;
  }

  details.vehicles.forEach((vehicle: any, index: number) => {
      if (index > 0) doc.addPage();

      // Background / Border
      doc.setDrawColor(0);
      doc.rect(2, 2, 81, 51);

      // Header
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("INSURANCE IDENTIFICATION CARD", 42.5, 6, { align: 'center' });
      
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text(AGENCY_INFO.name, 42.5, 9, { align: 'center' });

      // Company
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("COMPANY NUMBER", 4, 14);
      doc.text("COMPANY", 35, 14);
      
      doc.setFont("helvetica", "normal");
      doc.text("Unknown", 4, 17); // Carrier ID usually not available in simple object
      doc.text(policy.carrierName.substring(0, 25), 35, 17);

      // Policy Number & Dates
      doc.setFont("helvetica", "bold");
      doc.text("POLICY NUMBER", 4, 21);
      doc.text("EFFECTIVE DATE", 35, 21);
      doc.text("EXPIRATION DATE", 60, 21);

      doc.setFont("helvetica", "normal");
      doc.text(policy.number, 4, 24);
      doc.text(new Date(policy.effectiveDate).toLocaleDateString(), 35, 24);
      doc.text(new Date(policy.expirationDate).toLocaleDateString(), 60, 24);

      // Vehicle
      doc.setFont("helvetica", "bold");
      doc.text("YEAR", 4, 28);
      doc.text("MAKE/MODEL", 15, 28);
      doc.text("VIN", 50, 28);

      doc.setFont("helvetica", "normal");
      doc.text(vehicle.year.toString(), 4, 31);
      doc.text(`${vehicle.make} ${vehicle.model}`.substring(0, 20), 15, 31);
      doc.text(vehicle.vin || "N/A", 50, 31);

      // Insured
      doc.setFont("helvetica", "bold");
      doc.text("INSURED", 4, 35);
      doc.setFont("helvetica", "normal");
      
      // Try to construct name
      let insuredName = "Valued Client";
      if (details.drivers && details.drivers.length > 0) {
          insuredName = `${details.drivers[0].firstName} ${details.drivers[0].lastName}`;
      }
      doc.text(insuredName, 4, 38);
      
      // Disclaimer
      doc.setFontSize(4);
      doc.text("THIS CARD MUST BE KEPT IN THE INSURED VEHICLE AND PRESENTED UPON DEMAND", 42.5, 48, { align: 'center' });
      doc.text("IN CASE OF ACCIDENT: Report all accidents to your Agent or Company as soon as possible.", 42.5, 50, { align: 'center' });
  });

  doc.save(`Auto_ID_Cards_${policy.number}.pdf`);
};
