<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## BudgXlsTransform

Map fields for BUDG producer, XLS file types

Example input data: [stub][1]

Transform function: [implementation details][2]

**Parameters**

- `record` **[Object][3]** Piece of data to transform before going to harmonized storage.

Returns **Project** JSON matching the type fields.

### getCoordinators

Preprocess coordinators

Input fields taken from the `record` are:

- `Coordinator's name`
- `Coordinator organisation type`
- `Coordinator's address`
- `Coordinator's region`
- `Coordinator's country`
- `Coordinator's website`

**Parameters**

- `record` **[Object][3]** The row received from harmonized storage

Returns **[Array][4]** A list with a single {Coordinator} object

### formatDate

Format date

**Parameters**

- `date` **[Date][5]** Date in "10/9/14" (MM/DD/YY) or "10/9/2014" (MM/DD/YYYY) format

**Examples**

```javascript
input => '10/9/2014';
output => '2014-10-09T00:00:00.000Z';
```

Returns **[Date][5]** The date formatted into an ISO 8601 date format

### getProjectTitle

Preprocess `title`
Input fields taken from the `record` are:

- `Project Title`

**Parameters**

- `record` **[Object][3]** The row received from harmonized storage

Returns **[String][6]**

### getPartners

Preprocess partners

Input fields taken from the `record` are:

- `Partner {n} name`
- `Partner {n} organisation type`
- `Partner {n} address`
- `Partner {n} region`
- `Partner {n} country`
- `Partner {n} website`

**Parameters**

- `record` **[Object][3]** The row received from harmonized storage

Returns **[Array][4]** A list of {Partner} objects

### getLocations

Preprocess locations

Input fields taken from the `record` are:

- `Participating countries`

**Parameters**

- `record` **[Object][3]** The row received from parsed file

Returns **[Array][4]** List of {Location} objects for `project_locations` field

### getProjectId

Preprocess `project_id`
Seeks for values in the following precedence:

- `Project Number`

**Parameters**

- `record` **[Object][3]** The row received from parsed file

Returns **[String][6]**

### getCallYear

Preprocess `call_year`
Seeks for values in the following precedence:

- `Call year`

**Parameters**

- `record` **[Object][3]** The row received from parsed file

Returns **[String][6]**

### getDescription

Preprocess `description`
Seeks for values in the following precedence:

- `Project Summary`

**Parameters**

- `record` **[Object][3]** The row received from parsed file

Returns **[String][6]**

### getProjectWebsite

Preprocess `project_website`
Seeks for values in the following precedence:

- `Project Website`

**Parameters**

- `record` **[Object][3]** The row received from parsed file

Returns **[String][6]**

### getTypes

Converts a single string with commas to an array

Input fields taken from the `record` are:

- `Activity type`

**Parameters**

- `record` **[Object][3]** The row received from harmonized storage

**Examples**

```javascript
input => 'foo, bar, baz';
output => ['foo', 'bar', 'baz'];
```

Returns **[Array][4]** List of activity types

### getProjectStatus

Preprocess `status`
Seeks for values in the following precedence:

- `Project Status`

**Parameters**

- `record` **[Object][3]** The row received from parsed file

Returns **[String][6]**

### getSubProgramme

Preprocess `sub_programme_name`
Seeks for values in the following precedence:

- `Sub-programme`

**Parameters**

- `record` **[Object][3]** The row received from parsed file

Returns **[String][6]**

### getSuccessStory

Preprocess `success_story`
Seeks for values in the following precedence:

- `Is Success Story`

**Parameters**

- `record` **[Object][3]** The row received from parsed file

Returns **[String][6]**

### getStartDate

Get end date before formatting.

Input fields taken from the `record` are:

- `Start Date`

**Parameters**

- `record` **[Object][3]** The row received from parsed file

Returns **[String][6]**

### getEndDate

Get end date before formatting.

Input fields taken from the `record` are:

- `End Date`

**Parameters**

- `record` **[Object][3]** The row received from parsed file

Returns **[String][6]**

[1]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/budg/xls/test/stubs/record.json
[2]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/budg/xls/src/lib/transform.js
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date
[6]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String