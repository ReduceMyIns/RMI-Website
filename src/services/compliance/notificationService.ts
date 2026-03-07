import type { Vendor, Project } from '../../types/compliance.ts';

export const notificationService = {
  /**
   * Sends an initial invitation email to a vendor.
   */
  async sendVendorInvite(vendor: Vendor, project: Project, inviteUrl: string): Promise<void> {
    // TODO: Integrate with SendGrid/Postmark/AWS SES
    console.log(`Sending invite to ${vendor.email} for project ${project.name}. URL: ${inviteUrl}`);
  },

  /**
   * Sends a reminder email before a COI expires.
   */
  async sendExpirationReminder(vendor: Vendor, project: Project, daysUntilExpiration: number): Promise<void> {
    // TODO: Integrate with email provider
    console.log(`Sending expiration reminder to ${vendor.email} for project ${project.name}. Expires in ${daysUntilExpiration} days.`);
  },

  /**
   * Sends a notice of lapse when a COI expires or becomes non-compliant.
   */
  async sendLapseNotice(vendor: Vendor, project: Project, reason: string): Promise<void> {
    // TODO: Integrate with email provider
    console.log(`Sending lapse notice to ${vendor.email} for project ${project.name}. Reason: ${reason}`);
  }
};
