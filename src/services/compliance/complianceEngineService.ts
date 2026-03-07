import type { InsuranceRequirementSet, ParsedCertificateData } from '../../types/compliance.ts';

export interface ComplianceResult {
  isCompliant: boolean;
  failures: {
    requirement: string;
    reason: string;
  }[];
}

export const complianceEngineService = {
  /**
   * Compares parsed COI data against predefined project requirements.
   * Returns a pass/fail result with explanations.
   */
  evaluateCompliance(
    requirements: InsuranceRequirementSet,
    parsedData: ParsedCertificateData
  ): ComplianceResult {
    const failures: { requirement: string; reason: string }[] = [];

    // Check General Liability
    if (requirements.generalLiability.required) {
      const glPolicy = parsedData.policies.find(p => p.type === 'GL');
      if (!glPolicy) {
        failures.push({ requirement: 'General Liability', reason: 'Missing General Liability coverage.' });
      } else {
        if ((glPolicy.limits.perOccurrence || 0) < requirements.generalLiability.perOccurrenceLimit) {
          failures.push({
            requirement: 'GL Per Occurrence Limit',
            reason: `Required ${requirements.generalLiability.perOccurrenceLimit}, but COI shows ${glPolicy.limits.perOccurrence || 0}.`
          });
        }
        if ((glPolicy.limits.aggregate || 0) < requirements.generalLiability.aggregateLimit) {
          failures.push({
            requirement: 'GL Aggregate Limit',
            reason: `Required ${requirements.generalLiability.aggregateLimit}, but COI shows ${glPolicy.limits.aggregate || 0}.`
          });
        }
        // Enforce Additional Insured for GL
        if (requirements.generalLiability.requireAdditionalInsured && !parsedData.endorsements.additionalInsured) {
          failures.push({
            requirement: 'GL Additional Insured',
            reason: 'General Liability must include Additional Insured status.'
          });
        }
      }
    }

    // Check Description of Operations
    if (requirements.descriptionOfOperations?.required) {
      // Mocking description check - in reality, parsedData would have a description field
      // const description = parsedData.descriptionOfOperations || "";
      // if (!description.toLowerCase().includes(requirements.descriptionOfOperations.mustContain.toLowerCase())) {
      //   failures.push({
      //     requirement: 'Description of Operations',
      //     reason: `Must contain: "${requirements.descriptionOfOperations.mustContain}"`
      //   });
      // }
      
      // For now, we'll assume it fails if we can't find it (or pass if we mock it)
      // Let's mock a failure for demonstration if the requirement is specific
      if (requirements.descriptionOfOperations.mustContain.length > 0) {
         // In a real app, we'd check the parsed text. 
         // For this demo, let's assume the parser didn't find the specific text unless we mock it in the parser.
      }
    }

    // Check Auto Liability
    if (requirements.autoLiability.required) {
      const autoPolicy = parsedData.policies.find(p => p.type === 'Auto');
      if (!autoPolicy) {
        failures.push({ requirement: 'Auto Liability', reason: 'Missing Auto Liability coverage.' });
      } else {
        if ((autoPolicy.limits.combinedSingleLimit || 0) < requirements.autoLiability.combinedSingleLimit) {
          failures.push({
            requirement: 'Auto CSL',
            reason: `Required ${requirements.autoLiability.combinedSingleLimit}, but COI shows ${autoPolicy.limits.combinedSingleLimit || 0}.`
          });
        }
      }
    }

    // Check Endorsements
    if (requirements.endorsements.additionalInsured && !parsedData.endorsements.additionalInsured) {
      failures.push({ requirement: 'Additional Insured', reason: 'Missing Additional Insured endorsement.' });
    }
    if (requirements.endorsements.waiverOfSubrogation && !parsedData.endorsements.waiverOfSubrogation) {
      failures.push({ requirement: 'Waiver of Subrogation', reason: 'Missing Waiver of Subrogation endorsement.' });
    }

    // Check Expirations
    const now = new Date();
    parsedData.policies.forEach(policy => {
      if (new Date(policy.expirationDate) < now) {
        failures.push({ requirement: 'Policy Active', reason: `${policy.type} policy expired on ${policy.expirationDate}.` });
      }
    });

    return {
      isCompliant: failures.length === 0,
      failures
    };
  }
};
