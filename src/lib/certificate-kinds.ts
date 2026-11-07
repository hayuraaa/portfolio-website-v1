/** Fixed list; this order is also the order of the filter tabs. */
export const CERTIFICATE_KINDS = ["Certification", "Course", "Award"] as const;

export type CertificateKind = (typeof CERTIFICATE_KINDS)[number];
