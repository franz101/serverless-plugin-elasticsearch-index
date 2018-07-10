<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## InforegioJsonTransform

Map fields for INFOREGIO producer, JSON file types

Mapping document: [markdown version][1]
Transform function: [implementation details][2]

**Parameters**

-   `record` **[Object][3]** Piece of data to transform before going to harmonized storage.

Returns **Project** JSON matching the type fields.

### getFundingArea

Preprocess `funding_area`

Converts a single string to an array of multiple values

**Parameters**

-   `record` **[Object][3]** The row received from parsed file

**Examples**

```javascript
input => "Research & innovation; Investment for growth; Transport"
output => ["Research & innovation", "Investment for growth", "Transport"]
```

Returns **[Array][4]** List of string values for `funding_area` field

### formatDate

Format date

**Parameters**

-   `date` **[Date][5]** Date in "10/9/2014" (DD/MM/YYYY) format

**Examples**

```javascript
input => "01/01/2009"
output => "2009-01-01T00:00:00.000Z"
```

Returns **[Date][5]** The date formatted into an ISO 8601 date format

### getAddress

Preprocess address

Input fields taken from the `record` are:

-   `Beneficiary_address`
-   `Beneficiary_Post_Code`
-   `Beneficiary_City`

**Parameters**

-   `record` **[Object][3]** The row received from parsed file

Returns **[Array][4]** A list of {Partner} objects

### getBeneficiaries

Preprocess beneficiaries

Input fields taken from the `record` are:

-   `Beneficiary`
-   `Beneficiary_Country`

**Parameters**

-   `record` **[Object][3]** The row received from harmonized storage

Returns **[Array][4]** A list of a single {Beneficiary} object

### getLocations

Preprocess locations

Input fields taken from the `record` are:

-   `Project_country`
-   `Project_region`
-   `Project_NUTS2_code`

**Parameters**

-   `record` **[Object][3]** The row received from parsed file

Returns **[Array][4]** List of {Location} objects for `project_locations` field

### getProjectWebsite

Preprocess `project_website` field

Input fields taken from the `record` are:

-   `URL`

**Parameters**

-   `record` **[Object][3]** The row received from parsed file

Returns **[string][6]** 

### formatBudget

Preprocess value field of {BudgetItem}.

**Parameters**

-   `budget` **[string][6]** String containing numeric data

Returns **BudgetItem** 

## getNutsCodeLevel

Gets NUTS code level from a string

**Parameters**

-   `code` **[String][6]** The NUTS code

Returns **[Number][7]** The level of NUTS or null if one can't be extracted

[1]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/inforegio/mapping.md

[2]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/inforegio/json/src/lib/transform.js

[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date

[6]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[7]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number