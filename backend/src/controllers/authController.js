const mockUser = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@builtrix.tech",
  avatar: "JD",
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const token = `mock-jwt-token-${Date.now()}`;

    res.json({
      success: true,
      data: {
        user: mockUser,
        token,
      },
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: mockUser,
      message: "Profile retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
