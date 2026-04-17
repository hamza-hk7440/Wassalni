export const createControllerSchema = (body = {}) => {
  const errors = [];

  if (!body.email || typeof body.email !== "string") {
    errors.push("email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("email must be valid");
  }

  if (!body.password || typeof body.password !== "string") {
    errors.push("password is required");
  } else if (body.password.length < 6) {
    errors.push("password must be at least 6 characters");
  }

  if (!body.first_name || typeof body.first_name !== "string") {
    errors.push("first_name is required");
  }

  if (!body.last_name || typeof body.last_name !== "string") {
    errors.push("last_name is required");
  }

  if (body.role && !["controller", "admin"].includes(body.role)) {
    errors.push("role must be 'controller' or 'admin'");
  }

  return errors;
};

export const validate = (schema) => (req, res, next) => {
  const errors = schema(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors,
    });
  }

  next();
};
