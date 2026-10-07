from datetime import date, datetime

from app.core.database import SessionLocal
from app.models.scheme import Scheme

schemes = [
    {
        "name": "PM-KISAN",
        "short_name": "PM-KISAN",
        "description": "Income support scheme for eligible landholding farmer families through direct benefit transfers.",
        "category": "Income Support",
        "level": "central",
        "state": None,
        "target_beneficiaries": "Eligible landholding farmer families",
        "eligible_crops": "All crops",
        "benefits": "Direct income support subject to scheme eligibility and applicable guidelines.",
        "eligibility": "Eligible landholding farmer families as defined under the scheme guidelines.",
        "required_documents": "Aadhaar, bank account details and landholding-related records as applicable.",
        "application_process": "Use the official PM-KISAN portal and applicable state/local agriculture services.",
        "official_url": "https://pmkisan.gov.in/",
        "source_name": "Government of India",
        "application_start": None,
        "application_end": None,
        "is_active": True,
    },
    {
        "name": "Pradhan Mantri Fasal Bima Yojana",
        "short_name": "PMFBY",
        "description": "Crop insurance scheme providing insurance support against notified crop losses and risks.",
        "category": "Crop Insurance",
        "level": "central",
        "state": None,
        "target_beneficiaries": "Eligible farmers growing notified crops",
        "eligible_crops": "Notified crops",
        "benefits": "Crop insurance coverage according to notified crops, areas, risks and policy conditions.",
        "eligibility": "Farmers and crops covered under the applicable seasonal notification.",
        "required_documents": "Identity, bank, land and crop-related documents as applicable.",
        "application_process": "Apply through the notified channels for the relevant crop season.",
        "official_url": "https://pmfby.gov.in/",
        "source_name": "Government of India",
        "application_start": None,
        "application_end": None,
        "is_active": True,
    },
    {
        "name": "Pradhan Mantri Krishi Sinchayee Yojana - Per Drop More Crop",
        "short_name": "PMKSY - PDMC",
        "description": "Support for improving water-use efficiency through micro-irrigation and efficient water management.",
        "category": "Irrigation",
        "level": "central",
        "state": None,
        "target_beneficiaries": "Eligible farmers",
        "eligible_crops": "Applicable agricultural and horticultural crops",
        "benefits": "Support for eligible micro-irrigation and water-use efficiency interventions.",
        "eligibility": "Eligibility depends on applicable government guidelines and state implementation.",
        "required_documents": "Farmer identity, land and bank-related documents as applicable.",
        "application_process": "Apply through the applicable state agriculture scheme portal.",
        "official_url": "https://mahadbt.maharashtra.gov.in/",
        "source_name": "Maharashtra Agriculture Department / MahaDBT",
        "application_start": None,
        "application_end": None,
        "is_active": True,
    },
    {
        "name": "Sub-Mission on Agricultural Mechanization",
        "short_name": "SMAM",
        "description": "Support for agricultural mechanization and access to eligible farm machinery and equipment.",
        "category": "Farm Mechanization",
        "level": "central",
        "state": None,
        "target_beneficiaries": "Eligible farmers and agricultural beneficiaries",
        "eligible_crops": "All applicable crops",
        "benefits": "Support for eligible agricultural machinery and mechanization activities.",
        "eligibility": "Depends on applicable scheme guidelines and beneficiary category.",
        "required_documents": "Identity, land and other documents required by the applicable scheme.",
        "application_process": "Apply through the applicable government agriculture portal.",
        "official_url": "https://mahadbt.maharashtra.gov.in/",
        "source_name": "Maharashtra Agriculture Department / MahaDBT",
        "application_start": None,
        "application_end": None,
        "is_active": True,
    },
    {
        "name": "National Food Security Mission",
        "short_name": "NFSM",
        "description": "Agricultural support programme covering notified food grain, pulses and other crop components.",
        "category": "Crop Development",
        "level": "central",
        "state": None,
        "target_beneficiaries": "Eligible farmers under notified programme components",
        "eligible_crops": "Programme-notified crops",
        "benefits": "Support under applicable crop development and productivity improvement components.",
        "eligibility": "Depends on the applicable programme component and government guidelines.",
        "required_documents": "Documents specified by the implementing agriculture authority.",
        "application_process": "Follow the applicable state agriculture department process.",
        "official_url": "https://mahadbt.maharashtra.gov.in/",
        "source_name": "Maharashtra Agriculture Department / MahaDBT",
        "application_start": None,
        "application_end": None,
        "is_active": True,
    },
    {
        "name": "Dr. Babasaheb Ambedkar Krishi Swavalamban Yojana",
        "short_name": "DBAKSY",
        "description": "Agricultural support scheme listed by Maharashtra for eligible Scheduled Caste farmers.",
        "category": "Farmer Development",
        "level": "state",
        "state": "Maharashtra",
        "target_beneficiaries": "Eligible Scheduled Caste farmers in Maharashtra",
        "eligible_crops": "Applicable agricultural crops",
        "benefits": "Agricultural development assistance under applicable components of the scheme.",
        "eligibility": "Eligibility depends on scheme guidelines and beneficiary requirements.",
        "required_documents": "Documents required by the Maharashtra Agriculture Department and MahaDBT.",
        "application_process": "Apply through the Maharashtra MahaDBT farmer portal when the scheme is available.",
        "official_url": "https://mahadbt.maharashtra.gov.in/",
        "source_name": "Maharashtra Agriculture Department / MahaDBT",
        "application_start": None,
        "application_end": None,
        "is_active": True,
    },
    {
        "name": "Birsa Munda Krishi Kranti Yojana",
        "short_name": "BMKKY",
        "description": "Agricultural support scheme listed by Maharashtra for eligible Scheduled Tribe farmers.",
        "category": "Farmer Development",
        "level": "state",
        "state": "Maharashtra",
        "target_beneficiaries": "Eligible Scheduled Tribe farmers in Maharashtra",
        "eligible_crops": "Applicable agricultural crops",
        "benefits": "Agricultural development assistance under applicable components of the scheme.",
        "eligibility": "Eligibility depends on scheme guidelines and beneficiary requirements.",
        "required_documents": "Documents required by the Maharashtra Agriculture Department and MahaDBT.",
        "application_process": "Apply through the Maharashtra MahaDBT farmer portal when the scheme is available.",
        "official_url": "https://mahadbt.maharashtra.gov.in/",
        "source_name": "Maharashtra Agriculture Department / MahaDBT",
        "application_start": None,
        "application_end": None,
        "is_active": True,
    },
]

db = SessionLocal()

try:
    inserted = 0

    for data in schemes:
        existing = db.query(Scheme).filter(Scheme.name == data["name"]).first()

        if existing:
            continue

        scheme = Scheme(
            **data,
            last_verified_at=datetime.utcnow(),
        )

        db.add(scheme)
        inserted += 1

    db.commit()

    print(f"Inserted {inserted} schemes.")
    print(f"Total schemes: {db.query(Scheme).count()}")

finally:
    db.close()
