# Database Entity Relationship Diagram (ERD)

This document visualizes the relationships between the core entities in the Sota Platform database.

```mermaid
erDiagram
    %% Core Tenant Entities
    organizations ||--o{ users : "has members"
    organizations }|--|| pricing_plans : "subscribes to"

    %% Signal Entities
    signals }|--|| signal_types : "categorized as"
    
    %% Relationships logic
    organizations ||--o{ organization_signals : "has access to"
    signals ||--o{ organization_signals : "assigned to"

    %% Table Definitions
    organizations {
        uuid id PK
        string name
        string plan_id FK "not null, default tier-free"
        timestamp created_at
    }

    users {
        uuid id PK
        uuid organization_id FK
        string role "user | admin"
        string email
    }

    pricing_plans {
        string id PK "e.g. tier-1"
        string name
        numeric price_monthly
        numeric implementation_fee
        text[] features
        string currency "default USD"
        boolean active
    }

    signals {
        uuid id PK
        string type_id FK
        string title
        text content
        boolean is_active
        timestamp published_at
    }

    signal_types {
        string id PK "slug"
        string name
        int priority
        text description
    }

    organization_signals {
        uuid organization_id FK
        uuid signal_id FK
        timestamp assigned_at
    }
```

## Security Model (RLS)
-   **Users** can only see their own **Organization**.
-   **Users** can only see **Signals** that are linked to their Organization via `organization_signals`.
-   **Admins** have full access to all tables.
