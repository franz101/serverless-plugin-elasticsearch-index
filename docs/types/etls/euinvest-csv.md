<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## EuInvestCSVTransform

Map fields for EUINVEST producer, CSV file types

Example input data: [stub][1]

Transform function: [implementation details][2]

### Parameters

- `record` **[Object][3]** Piece of data to transform before going to harmonized storage.

Returns **Project** JSON matching the type fields.

### getBudget

Preprocess `budget` field.

Input fields taken from the `record` are:

- `_eu_funding`

#### Parameters

- `record` **[Object][3]** The row received from parsed file

Returns **Budget**

### getDescription

Preprocess `description` field.

Input fields taken from the `record` are:

- `_about_this_project`
- `_background_info`

#### Parameters

- `record` **[Object][3]** The row received from parsed file

Returns **[String][4]**

### getMedia

Preprocess `media` field.

Input fields taken from the `record` are:

- `_banner`
- `_banner_copy`
- `_visual`
- `_images_copyright`

#### Parameters

- `record` **[Object][3]** The row received from parsed file

Returns **[Array][5]&lt;Media>**

### getId

Preprocess `project_id` field.

Input fields taken from the `record` are:

- `_nid`

#### Parameters

- `record` **[Object][3]** The row received from parsed file

Returns **[String][4]**

### getLocations

Preprocess `locations` field.

Input fields taken from the `record` are:

- `_location`

#### Parameters

- `record` **[Object][3]** The row received from parsed file

Returns **[Array][5]&lt;[Location][6]>**

### getLinks

Preprocess `related_links` field.

Input fields taken from the `record` are:

- `_external_links`

#### Parameters

- `record` **[Object][3]** The row received from parsed file

Returns **[Array][5]&lt;RelatedLink>**

### getThemes

Preprocess `themes` field.

Input fields taken from the `record` are:

- `_sector`

#### Parameters

- `record` **[Object][3]** The row received from parsed file

Returns **[Array][5]**

### getThirdParties

Preprocess `third_parties` field.

Input fields taken from the `record` are:

- `_coordinator`
- `_partners`

#### Parameters

- `record` **[Object][3]** The row received from parsed file

Returns **[Array][5]&lt;ThirdParty>**

### formatDate

Format date

#### Parameters

- `date` **[Date][7]** Date in DD/MM/YYYY format

#### Examples

```javascript
input => '01/01/2009';
output => '2009-01-01T00:00:00.000Z';
```

Returns **[Date][7]** The date formatted into an ISO 8601 date format

### getTimeframe

Preprocess `timeframe` field.

Input fields taken from the `record` are:

- `Timeframe`

#### Parameters

- `record` **[Object][3]** The row received from parsed file

Returns **Timeframe**

### getTitle

Preprocess `title` field.

Input fields taken from the `record` are:

- `_title`
- `_subtitle`

#### Parameters

- `record` **[Object][3]** The row received from parsed file

Returns **[String][4]**

[1]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/euinvest/csv/test/stubs/record.json
[2]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/euinvest/csv/src/lib/transform.js
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[6]: https://developer.mozilla.org/docs/Web/API/Location
[7]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date