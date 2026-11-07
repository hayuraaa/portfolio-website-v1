import type { Certificate } from "@/db/schema";
import { mediaUrl } from "@/lib/profile";
import type { CertificateFormData } from "./certificate-form";

export function toFormData(c: Certificate | null): CertificateFormData {
  return {
    id: c?.id ?? null,
    values: {
      title: c?.title ?? "",
      issuer: c?.issuer ?? "",
      kind: c?.kind ?? "",
      issuedOn: c?.issuedOn ?? "",
      expiresOn: c?.expiresOn ?? "",
      credentialId: c?.credentialId ?? "",
      credentialUrl: c?.credentialUrl ?? "",
      skills: c?.skills.join(", ") ?? "",
    },
    isPublished: c?.isPublished ?? true,
    imageUrl: mediaUrl(c?.image ?? null),
  };
}
