# Security Security Specification - TUT Smart Assistant

## Data Invariants
1. A user profile (`/users/{userId}`) can only be created by the authenticated user whose `uid` matches `{userId}`.
2. User profiles are immutable once created (specifically `studentNumber` and `idNumber`).
3. Campus insights (`/insights/{insightId}`) can only be created by authenticated users (in this demo, to seed the pulse).
4. Users can only read their own profile.
5. Campus insights are public (for authenticated students).

## The "Dirty Dozen" (Attack Payloads)
1. **Identity Spoofing**: Attempt to create a profile for `uid_A` while logged in as `uid_B`.
2. **Profile Overwrite**: Attempt to update another student's profile.
3. **Immutability Breach**: Attempt to change the `studentNumber` of an existing profile.
4. **ID Poisoning**: Attempt to create a user with a document ID that is a 1MB string of junk characters.
5. **PII Leak**: Unauthenticated user attempts to list all users.
6. **Shadow Update**: Attempt to update a user profile with an extra field `isVerified: true`.
7. **Type Mismatch**: Attempt to set `studentNumber` as a number instead of a 9-digit string.
8. **Malicious Insight**: Attempt to create an insight with 1MB of content.
9. **Recursive Cost Attack**: Attempt to list `users` collection without a security boundary (blanket read).
10. **State Shortcutting**: Attempt to update `updatedAt` with a client-side timestamp instead of `request.time`.
11. **Orphaned Writes**: Attempt to save a user with a `studentNumber` that doesn't follow the 9-digit format.
12. **Unverified Auth**: Attempt to write data while logged in but with a spoofed/unverified auth token (if verified email is enforced).

## Test Runner Verification
Existing rules must reject all the above payloads.
