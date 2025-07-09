import axios from "axios";

const API_BASE_URL = "https://services.leadconnectorhq.com/custom-menus";
const API_VERSION = "2021-07-28";

// Get custom menu by ID
export const getCustomMenuById = async (req, res) => {
  const { customMenuId } = req.params;
  const BEARER_TOKEN = req.headers.authorization?.split(" ")[1];

  if (!BEARER_TOKEN) {
    return res.status(400).json({ message: "Bearer token is required" });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/${customMenuId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Version: API_VERSION,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    const statusCode = error.response?.status || 500;
    console.error("Error fetching custom menu:", errorMessage);
    res.status(statusCode).json({
      message: "Failed to fetch custom menu",
      error: errorMessage,
    });
  }
};

// Get custom menus
export const getCustomMenus = async (req, res) => {
  const BEARER_TOKEN = req.headers.authorization?.split(" ")[1];
  const {
    limit = 20,
    locationId,
    query,
    showOnCompany,
    skip = 0,
    ...otherParams
  } = req.query;

  if (!BEARER_TOKEN) {
    return res.status(400).json({ message: "Bearer token is required" });
  }

  try {
    const params = new URLSearchParams();
    if (locationId) {
      params.append("locationId", locationId);
    }

    params.append("limit", limit);

    if (query) {
      params.append("query", query);
    }

    if (showOnCompany) {
      params.append("showOnCompany", showOnCompany);
    }

    if (skip) {
      params.append("skip", skip);
    }

    for (const key in otherParams) {
      if (otherParams.hasOwnProperty(key)) {
        params.append(key, otherParams[key]);
      }
    }

    const apiUrl = `${API_BASE_URL}/?${params.toString()}`;

    const response = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Version: API_VERSION,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    const statusCode = error.response?.status || 500;
    console.error("Error fetching custom menus:", errorMessage);
    res.status(statusCode).json({
      message: "Failed to fetch custom menus",
      error: errorMessage,
    });
  }
};

// Create custom menu
export const createCustomMenu = async (req, res) => {
  const BEARER_TOKEN = req.headers.authorization?.split(" ")[1];

  if (!BEARER_TOKEN) {
    return res.status(400).json({ message: "Bearer token is required" });
  }

  const createMenuApiUrl = `${API_BASE_URL}/`;

  try {
    const response = await axios.post(createMenuApiUrl, req.body, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Version: API_VERSION,
        "Content-Type": "application/json",
      },
    });

    res.status(201).json({ customMenu: response.data });
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    const statusCode = error.response?.status || 500;
    console.error("Error creating custom menu:", errorMessage);

    res.status(statusCode).json({
      message: "Failed to create custom menu",
      error: errorMessage,
    });
  }
};

// Update custom menu
export const updateCustomMenu = async (req, res) => {
  const { customMenuId } = req.params;
  const BEARER_TOKEN = req.headers.authorization?.split(" ")[1];

  if (!BEARER_TOKEN) {
    return res.status(400).json({ message: "Bearer token is required" });
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/${customMenuId}`,
      req.body,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${BEARER_TOKEN}`,
          Version: API_VERSION,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ success: true, customMenu: response.data });
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    const statusCode = error.response?.status || 500;
    console.error("Error updating custom menu:", errorMessage);

    res.status(statusCode).json({
      message: "Failed to update custom menu",
      error: errorMessage,
    });
  }
};

// Delete custom menu
export const deleteCustomMenu = async (req, res) => {
  const { customMenuId } = req.params;
  const BEARER_TOKEN = req.headers.authorization?.split(" ")[1];

  if (!BEARER_TOKEN) {
    return res.status(400).json({ message: "Bearer token is required" });
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/${customMenuId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Version: API_VERSION,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    const statusCode = error.response?.status || 500;
    console.error("Error deleting custom menu:", errorMessage);

    res.status(statusCode).json({
      message: "Failed to delete custom menu",
      error: errorMessage,
    });
  }
};
