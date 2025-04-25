const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

dotenv.config();

// Initialize the Google GenAI client
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define modality constants since they won't be available from import
const Modality = {
  TEXT: "text",
  IMAGE: "image"
};

// Generate image function
const generateImage = async (prompt) => {
  try {
    console.log("Generating image with prompt:", prompt);
    
    // Set responseModalities to include "Image" so the model can generate an image
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    
    console.log("Received response from Gemini API");
    
    // Process the response to extract image data
    let imageData = null;
    
    if (response.candidates && 
        response.candidates[0] && 
        response.candidates[0].content && 
        response.candidates[0].content.parts) {
      
      // Log structure for debugging
      console.log("Response structure:", JSON.stringify(response.candidates[0].content.parts.length));
      
      // Process the response
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          // Get base64 image data
          imageData = part.inlineData.data;
          console.log("Found image data");
          break;
        }
      }
    } else {
      console.log("Unexpected response structure:", JSON.stringify(response));
    }
    
    if (!imageData) {
      console.log("No image data found in response");
      return {
        success: false,
        error: "No image data was generated in the response"
      };
    }
    
    console.log("Successfully extracted image data");
    
    // Return the base64 data directly
    return {
      success: true,
      imageData: imageData,
      message: "Image generated successfully"
    };
    
  } catch (error) {
    console.error("Error generating image:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = { generateImage };