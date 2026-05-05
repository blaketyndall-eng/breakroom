# SleepNet Relationships

SleepNet relationships are the first connective tissue between pages.

## Public module label

```txt
More Like This, Unfortunately
```

This should not feel like a clean recommendation engine. It should feel like a weird relationship drawer.

## Product idea

```txt
SleepNet Page = one room
Relationship = another room the directory thinks is involved
```

Relationship logic can be useful, wrong, funny, hostile, seeded, owner-pinned, or officially unrelated.

## Relationship types

```txt
same_owner
same_faction
same_object
same_site_type
same_neighborhood
funny_relation
rival_relation
agent_created
random_dead_link
probably_related
owes_money_to_this_page
stole_its_lighter
same_bad_idea
seen_together
officially_unrelated
```

## Files

```txt
src/lib/sleepnetRelationships.ts
src/components/sleepnet/MoreLikeThis.astro
src/components/sleepnet/SleepNetSiteView.astro
src/styles/sleepnet-relationships.css
```

## V1 sources

```txt
seeded relationships
manual relatedLinks schema hook
computed relationship helpers
```

Computed helpers support:

```txt
same faction affinity
same related object
same site type
same neighborhood
```

The public page currently renders the module from the helper layer. Seeded canonical pages, especially Very Good Burger, get the first visible relationships.

## Very Good Burger seeded links

```txt
Legal Napkin Pack -> same bad idea
Still Open Burger search -> probably related
Get Fatter By Friday dead link -> dead link cousin
Night Drinkers -> seen together
```

## Manual pinned links

The helper supports a lightweight `relatedLinks` field on a SleepNet site:

```ts
relatedLinks?: {
  href: string;
  title: string;
  relationshipType: SleepNetRelationshipType;
  note?: string;
}[];
```

Full editor UI for owner-pinned relationships can come later.

## Product truth

SleepNet should feel like an internet, not isolated pages.

A good relationship should create another door, not explain the house.
