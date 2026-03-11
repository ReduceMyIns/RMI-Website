import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/nowcerts';

async function testGetPolicies() {
    const email = "chenderson@reducemyinsurance.net";
    const user = { email: email };
    
    let allPolicies = [];
    if (email) {
        const filter = `$filter=(contains(eMail, '${email}') or contains(eMail2, '${email}') or contains(eMail3, '${email}'))`;
        const url = `${BASE_URL}/api/InsuredList()?${encodeURI(filter)}&$orderby=type asc&$count=true`;
        
        const res = await fetch(url);
        if (res.ok) {
            const searchResult = await res.json();
            if (searchResult && searchResult.value && searchResult.value.length > 0) {
                for (const insured of searchResult.value) {
                    const id = insured.id || insured.databaseId;
                    if (!id) continue;
                    const query = `$filter=insuredDatabaseId eq ${id}&$top=100&$skip=0&$orderby=effectiveDate desc`;
                    const policyUrl = `${BASE_URL}/api/PolicyDetailList?${encodeURI(query)}`;
                    console.log("Fetching policies for", id, ":", policyUrl);
                    const pRes = await fetch(policyUrl);
                    if (pRes.ok) {
                        const data = await pRes.json();
                        if (data && data.value && Array.isArray(data.value)) {
                            allPolicies = allPolicies.concat(data.value);
                            console.log("Found", data.value.length, "policies for", id);
                            for (const p of data.value) {
                                console.log(`Policy ${p.number}: isQuote=${p.isQuote}, status=${p.status}, active=${p.active}`);
                            }
                        }
                    } else {
                        console.log("Failed to fetch policies for", id, ":", pRes.status, await pRes.text());
                    }
                }
            }
        } else {
            console.log("Search failed:", res.status, await res.text());
        }
    }
    console.log("Total policies:", allPolicies.length);
}

testGetPolicies();
