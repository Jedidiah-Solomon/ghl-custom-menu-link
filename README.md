# Custom Menu Links API

## Overview

Welcome to the **Custom Menu Links API**! This API allows developers to programmatically manage custom menus, create custom links, and handle menu configurations efficiently.

### What's New?

We've introduced two new scopes for accessing custom menu links:

- `custom-menu-link.readonly`
- `custom-menu-link.write`

## API Endpoints

### 1. Retrieve all custom menus

**GET** `/custom-menus`

- Fetches all custom menus with filtering and pagination options.
- **Response:** Returns a list of menus.

```
{
    "customMenu": {
      "id": "12345",
      "icon": {
        "name": "yin-yang",
        "fontFamily": "fab"
      },
      "title": "Dashboard",
      "url": "/dashboard",
      "order": 1,
      "showOnCompany": true,
      "showOnLocation": true,
      "showToAllLocations": true,
      "locations": [
        "gfWreTIHL8pDbggBb7af",
        "67WreTIHL8pDbggBb7ty"
      ],
      "openMode": "iframe",
      "userRole": "all",
      "allowCamera": false,
      "allowMicrophone": false
    }
  }
```

### 2. Get specific menu details

**GET** `/custom-menus/:customMenuId`

- Retrieves details of a specific menu by its ID.
- **Response:** Returns menu details.

```
{
    "customMenus": [
      {
        "id": "12345",
        "icon": {
          "name": "yin-yang",
          "fontFamily": "fab"
        },
        "title": "Dashboard",
        "url": "/dashboard",
        "order": 1,
        "showOnCompany": true,
        "showOnLocation": true,
        "showToAllLocations": true,
        "locations": [
          "gfWreTIHL8pDbggBb7af",
          "67WreTIHL8pDbggBb7ty"
        ],
        "openMode": "iframe",
        "userRole": "all",
        "allowCamera": false,
        "allowMicrophone": false
      }
    ],
    "totalLinks": 100
  }
```

### 3. Create a new custom menu link

**POST** `/custom-menus`

- Allows creation of new custom menu links with icon support.
- **Request Body:**
  ```json
  {
    "title": "My Awesome Menu",
    "url": "https://example.com/my-menu",
    "icon": {
      "value": {
        "name": "layer-group",
        "fontFamily": "fas" //far,fab (only fontawesome free icons are allowed) https://doc.clickup.com/8631005/d/h/87cpx-243696/d60fa70db6b92b2
      }
    },
    "showOnCompany": true,
    "showOnLocation": true,
    "showToAllLocations": true,
    "openMode": "new_tab", //iframe ,new_tab,current_tab
    "locations": [],
    "userRole": "all", //all, admin,user
    "allowCamera": false,
    "allowMicrophone": false
  }
  ```
  locations:List of sub-account IDs where the menu should be shown. This list is applicable only when showOnLocation is true and showToAllLocations is false
- **Response:** Returns the created menu.

```
{
  "customMenu": {
    "id": "12345",
    "icon": {
      "name": "yin-yang",
      "fontFamily": "fab"
    },
    "title": "Dashboard",
    "url": "/dashboard",
    "order": 1,
    "showOnCompany": true,
    "showOnLocation": true,
    "showToAllLocations": true,
    "locations": [
      "gfWreTIHL8pDbggBb7af",
      "67WreTIHL8pDbggBb7ty"
    ],
    "openMode": "iframe",
    "userRole": "all",
    "allowCamera": false,
    "allowMicrophone": false
  }
}
```

### 4. Update an existing menu

**PUT** `/custom-menus/:customMenuId`

- Updates an existing menu configuration.
- **Request Body:**
  ```json
  {
    "name": "Updated Menu Name",
    "icon": "new-icon.png"
  }
  ```
- **Response:** Returns the updated menu details.

### 5. Delete a custom menu

**DELETE** `/custom-menus/:customMenuId`

- Removes a specific custom menu.
- **Response:** Confirms successful deletion.

## Why is this important?

Agencies and SaaS businesses catering to multiple industries can now effectively manage custom menus through APIs, saving hours of manual effort.

## Authentication

- The API requires authentication via an API key or OAuth token.
- Ensure you pass the authentication headers with each request:
  ```bash
  Authorization: Bearer YOUR_ACCESS_TOKEN
  ```
