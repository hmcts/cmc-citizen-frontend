# Design standards
The styles & elements used in this application are [`govuk-elements-sass`](https://www.npmjs.com/package/govuk-elements-sass) & [`govuk-elements`](https://github.com/alphagov/govuk_elements). These standards do not support [Web Content Accessibility Guidelines (WCAG 2.1 level AA) accessibility standard](https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps#meeting-accessibility-requirements) and is no longer maintained.

To solve accessibility issues and follow new design guidelines, we are incrementally introducing latest design system [GOV.UK DESIGN SYSTEM(GDS)](https://design-system.service.gov.uk/).

As we incrementally adapt to the new design standards, we don't want to completely remove existing(old) design standards unitll the migration is complete. So we need to ensure both old and new design system can co-exist in the same application ecosystem 

# Migrating to New Design Standards
Since the migration to new design standards is incremental, we made sure both old and new systems can co-exist. We made latest GDS styles avaialble for consumption in the current application and also provided option for selective loading of styles.

### Where to find GDS related files
> All *.scss files that follow GDS standards reside in `src/main/public/stylesheets/govuk-frontend` folder.

### Defaults GDS CSS
> By deault all GDS styles are exported to `src/main/public/stylesheets/govuk-frontend/all.css`. Below sample implemenation explains how GDS styles can be consumed in the application.

Sample implementation on consuming default GDS styles

```javascript
// src/main/features/dashboard/views/defendant.njk

{% block additional_head %}
    <link rel="stylesheet" href="{{ asset_paths['style'] }}/govuk-frontend/all.css"/>
{% endblock %}
```

### Selective loading of GDS styes

> All *.scss files in the root of `src/main/public/stylesheets/govuk-fronend` are converted to respective *.css file and placed in `src/main/public/stylesheets/govuk-frontend`. 

For example `src/main/public/stylesheets/govuk-fronend/tast-list.scss` generates corresponding CSS file and adds it to `src/main/public/stylesheets/govuk-frontend/task-list.css`

Look at this file `src/main/public/stylesheets/govuk-fronend/tast-list.scss`, you will notice that it is selectively loading only 'base', 'core', 'components/tag' & 'overrides' styles from the GDS.

```javascript
/* 
    * Rather than loading all GDS CSS, we are selectively loading specfics parts of CSS.
    * This approach of selective loading outputs lesser file sizes.
*/
@import "node_modules/govuk-frontend/govuk/base";
@import "node_modules/govuk-frontend/govuk/core/all";
@import "node_modules/govuk-frontend/govuk/components/tag/index";
@import "node_modules/govuk-frontend/govuk/overrides/all";
```

> More on selective loading can be found at [GOVUK DESIGN SYSTEM importing specific parts of the css](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#import-css-assets-and-javascript)

### How GDS css files are generated and loaded.
`gulpfile.js` contains tasks named `sass` & `sass-govuk-frontend`. These 2 tasks control how old and new design system's *.scss files are handled.
