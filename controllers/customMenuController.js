import axios from "axios";
import { getCompanyAccessToken } from "../utils/helper.js";

const API_BASE_URL = "https://services.leadconnectorhq.com/custom-menus";
const API_VERSION = "2021-07-28";

// Create custom menu

export const createCustomMenu = async (req, res) => {
  const {
    companyId,
    title,
    url,
    icon,
    openMode,
    userRole,
    allowCamera,
    allowMicrophone,
    locations,
  } = req.body;

  // Validate companyId
  if (!companyId || typeof companyId !== "string" || companyId.trim() === "") {
    return res.status(400).json({
      message: "Company ID is required and must be a non-empty string",
    });
  }

  // Validate title
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Validation failed",
      error: "Title is required and must be a non-empty string",
    });
  }

  // Validate URL
  if (!url || typeof url !== "string" || url.trim() === "") {
    return res.status(400).json({
      message: "Validation failed",
      error: "URL is required and must be a non-empty string",
    });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({
      message: "Validation failed",
      error: "URL must be a valid URL format",
    });
  }

  // Validate icon if provided
  if (icon && (typeof icon !== "object" || !icon.name || !icon.fontFamily)) {
    return res.status(400).json({
      message: "Validation failed",
      error: "Icon must have both 'name' and 'fontFamily' properties",
    });
  }

  // Validate locations if provided
  if (locations !== undefined) {
    if (!Array.isArray(locations)) {
      return res.status(400).json({
        message: "Validation failed",
        error: "Locations must be an array",
      });
    }

    if (locations.length === 0) {
      return res.status(400).json({
        message: "Validation failed",
        error: "Locations array must contain at least one location ID",
      });
    }

    const invalidLocations = locations.filter(
      (loc) => typeof loc !== "string" || loc.trim() === ""
    );

    if (invalidLocations.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        error: "All location IDs must be non-empty strings",
      });
    }
  }

  try {
    const { accessToken } = await getCompanyAccessToken(companyId);
    console.log("Access Token decrypted for custom menu:", accessToken);

    const requestBody = {
      title: title.trim(),
      url: url.trim(),
      icon: icon || undefined,
      showOnCompany: false,
      showOnLocation: true,
      showToAllLocations: false,
      openMode: openMode || "iframe",
      userRole: userRole || "all",
      allowCamera: !!allowCamera,
      allowMicrophone: !!allowMicrophone,
      ...(locations?.length && {
        locations: locations.map((loc) => loc.trim()),
      }),
    };

    const response = await axios.post(`${API_BASE_URL}/`, requestBody, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        Version: API_VERSION,
        "Content-Type": "application/json",
      },
    });

    return res.status(201).json({
      success: true,
      customMenu: response.data,
    });
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    const statusCode = error.response?.status || 500;
    console.error("Error creating custom menu:", errorMessage);

    if (error.response?.data?.errors) {
      return res.status(statusCode).json({
        message: "API validation failed",
        errors: error.response.data.errors,
      });
    }

    if (error.message.includes("No token data found")) {
      return res.status(401).json({
        message: "Authentication failed",
        error: "Company access token not found. Please reconnect your account.",
      });
    }

    return res.status(statusCode).json({
      message: "Failed to create custom menu",
      error: errorMessage,
    });
  }
};

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

// Helper function to get custom menus
const getCustomMenus = async (companyId, customMenuId = null) => {
  try {
    const { accessToken } = await getCompanyAccessToken(companyId);

    if (!accessToken) {
      throw new Error("Company access token not found");
    }

    const apiUrl = customMenuId
      ? `${API_BASE_URL}/${customMenuId}`
      : `${API_BASE_URL}/`;

    const response = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        Version: API_VERSION,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in getCustomMenus helper:", error);
    throw error;
  }
};

export const updateCustomMenu = async (req, res) => {
  const { customMenuId } = req.params;
  const { companyId, ...updateData } = req.body;

  if (!companyId || typeof companyId !== "string" || companyId.trim() === "") {
    return res.status(400).json({
      message: "Company ID is required and must be a non-empty string",
    });
  }

  if (
    !customMenuId ||
    typeof customMenuId !== "string" ||
    customMenuId.trim() === ""
  ) {
    return res.status(400).json({
      message: "Custom Menu ID is required and must be a non-empty string",
    });
  }

  try {
    const existingMenus = await getCustomMenus(companyId);

    const menuToUpdate = existingMenus.customMenus
      ? existingMenus.customMenus.find((menu) => menu.id === customMenuId)
      : existingMenus.id === customMenuId
      ? existingMenus
      : null;

    if (!menuToUpdate) {
      return res.status(404).json({
        message: "Custom menu not found",
        error: `No menu found with ID ${customMenuId}`,
      });
    }

    const { accessToken } = await getCompanyAccessToken(companyId);

    if (!accessToken) {
      return res.status(401).json({
        message: "Authentication failed",
        error: "Company access token not found. Please reconnect your account.",
      });
    }

    const payload = {
      ...(updateData.title && { title: updateData.title.trim() }),
      ...(updateData.url && { url: updateData.url.trim() }),
      ...(updateData.icon && {
        icon: {
          name: updateData.icon.name,
          fontFamily: updateData.icon.fontFamily,
        },
      }),
      ...(updateData.openMode && { openMode: updateData.openMode }),
      ...(updateData.userRole && { userRole: updateData.userRole }),
      ...(typeof updateData.allowCamera === "boolean" && {
        allowCamera: updateData.allowCamera,
      }),
      ...(typeof updateData.allowMicrophone === "boolean" && {
        allowMicrophone: updateData.allowMicrophone,
      }),
      ...(updateData.locations && {
        locations: updateData.locations.map((loc) => loc.trim()),
      }),
    };

    const response = await axios.put(
      `${API_BASE_URL}/${customMenuId}`,
      payload,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          Version: API_VERSION,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      customMenu: response.data,
    });
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    const statusCode = error.response?.status || 500;
    console.error("Error updating custom menu:", errorMessage);

    if (error.response?.data?.errors) {
      return res.status(statusCode).json({
        message: "API validation failed",
        errors: error.response.data.errors,
      });
    }

    return res.status(statusCode).json({
      message: "Failed to update custom menu",
      error: errorMessage,
    });
  }
};

// Get Custom Menu
export const getCustomMenu = async (req, res) => {
  const { companyId } = req.query;
  const { customMenuId } = req.params;

  if (!companyId || typeof companyId !== "string" || companyId.trim() === "") {
    return res.status(400).json({
      message: "Company ID is required and must be a non-empty string",
    });
  }

  try {
    const menuData = await getCustomMenus(companyId, customMenuId);
    return res.status(200).json(menuData);
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    const statusCode = error.response?.status || 500;
    console.error("Error fetching custom menu:", errorMessage);

    return res.status(statusCode).json({
      message: "Failed to fetch custom menu",
      error: errorMessage,
    });
  }
};

// Delete custom menu
export const deleteCustomMenu = async (req, res) => {
  const { customMenuId } = req.params;
  const { companyId } = req.body;

  if (!companyId || typeof companyId !== "string" || companyId.trim() === "") {
    return res.status(400).json({
      message: "Company ID is required and must be a non-empty string",
    });
  }

  if (
    !customMenuId ||
    typeof customMenuId !== "string" ||
    customMenuId.trim() === ""
  ) {
    return res.status(400).json({
      message: "Custom Menu ID is required and must be a non-empty string",
    });
  }

  try {
    const existingMenus = await getCustomMenus(companyId);
    const menuExists = existingMenus.customMenus
      ? existingMenus.customMenus.some((menu) => menu.id === customMenuId)
      : existingMenus.id === customMenuId;

    if (!menuExists) {
      return res.status(404).json({
        message: "Custom menu not found",
        error: `No menu found with ID ${customMenuId}`,
      });
    }

    const { accessToken } = await getCompanyAccessToken(companyId);

    if (!accessToken) {
      return res.status(401).json({
        message: "Authentication failed",
        error: "Company access token not found. Please reconnect your account.",
      });
    }

    const response = await axios.delete(`${API_BASE_URL}/${customMenuId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        Version: API_VERSION,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Custom menu successfully deleted",
      deletedMenuId: customMenuId,
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    const statusCode = error.response?.status || 500;
    console.error("Error deleting custom menu:", errorMessage);

    if (error.response?.data?.errors) {
      return res.status(statusCode).json({
        message: "API validation failed",
        errors: error.response.data.errors,
      });
    }

    return res.status(statusCode).json({
      message: "Failed to delete custom menu",
      error: errorMessage,
    });
  }
};
