/**
 * MISSION MPSO — Source Registry & Compliance Engine
 * Manages trusted source catalog, licensing permissions, and crawling compliance.
 */

import { ContentSource, SourceCategory, SourceTrustTier, LicenseType, ReusePermission } from "@/types/pipeline";
import { db } from "../db";

export interface CrawlPermissionCheck {
  allowed: boolean;
  reason: string;
  reusePermission: ReusePermission;
  attributionRequired: boolean;
  maxRequestsPerMinute: number;
}

export class SourceRegistryService {
  /**
   * Retrieves all registered sources, optionally filtered by active status or tier.
   */
  static getSources(options?: { activeOnly?: boolean; tier?: SourceTrustTier }): ContentSource[] {
    let sources = db.getContentSources(options?.activeOnly);
    if (options?.tier) {
      sources = sources.filter((s) => s.trustTier === options.tier);
    }
    return sources;
  }

  /**
   * Register or update an educational source with strict compliance checks.
   */
  static registerSource(source: ContentSource): ContentSource {
    // Enforce licensing and reuse integrity
    this.validateSourceCompliance(source);
    return db.saveContentSource(source);
  }

  /**
   * Check whether a source or URL is permitted for automated scanning and what reuse is allowed.
   */
  static checkCrawlPermissions(source: ContentSource): CrawlPermissionCheck {
    if (!source.isActive) {
      return {
        allowed: false,
        reason: "Source is marked inactive in registry.",
        reusePermission: "metadata_and_citation_only",
        attributionRequired: true,
        maxRequestsPerMinute: 0,
      };
    }

    if (!source.crawlingAllowed) {
      return {
        allowed: false,
        reason: "Robots.txt or terms of service do not allow automated crawling for this domain.",
        reusePermission: "metadata_and_citation_only",
        attributionRequired: true,
        maxRequestsPerMinute: 0,
      };
    }

    // Tier-specific rate limits and reuse policies
    let maxRpm = 10;
    if (source.trustTier === 1) {
      maxRpm = 5; // Very respectful towards official commission portal
    } else if (source.trustTier === 2) {
      maxRpm = 8;
    } else if (source.trustTier >= 3) {
      maxRpm = 12;
    }

    return {
      allowed: true,
      reason: `Permitted under ${source.licenseType} (${source.reusePermissions})`,
      reusePermission: source.reusePermissions,
      attributionRequired: true,
      maxRequestsPerMinute: maxRpm,
    };
  }

  /**
   * Validate source compliance against ethical principles:
   * - No copyright infringement
   * - No paywall/auth bypass
   * - Required tier classification
   */
  private static validateSourceCompliance(source: ContentSource) {
    if (!source.name || !source.url) {
      throw new Error("Source must have a valid name and URL.");
    }

    if (source.trustTier < 1 || source.trustTier > 5) {
      throw new Error("Invalid trust tier. Must be between 1 and 5.");
    }

    // Third-party commercial question sites must NEVER be granted full_question_reproduction without explicit license
    if (source.sourceCategory === "third_party_reference" && source.reusePermissions === "full_question_reproduction") {
      if (source.licenseType !== "creative_commons_by" && source.licenseType !== "creative_commons_by_sa") {
        throw new Error(
          "Third-party educational references cannot be granted full question reproduction without verified Creative Commons or open license."
        );
      }
    }
  }

  /**
   * Format legal attribution for content sourced from a given source.
   */
  static getAttributionNotice(source: ContentSource, documentTitle?: string): string {
    switch (source.licenseType) {
      case "official_tgpsc_public_notice":
        return `TGPSC / TSPSC Official Public Examination Archive (${source.name}). For candidate preparation under Fair Educational Use.`;
      case "government_open_data":
        return `Official Open Government Data (${source.name}, ${documentTitle || "Public Release"}).`;
      case "creative_commons_by":
      case "creative_commons_by_sa":
        return `Open Educational Resource licensed under ${source.licenseType.toUpperCase().replace(/_/g, "-")} (${source.name}).`;
      case "restricted_metadata_only":
        return `Citation reference: ${source.name} (${source.url}). Full text not reproduced.`;
      default:
        return `Sourced from ${source.name}. Attribution maintained.`;
    }
  }
}
