const ResponseConstants = {
  Common: {
    200: {
      error: false,
      statusString: "OK",
      statusCode: 200,
      message: "Request served successfully."
    },
    201: {
      error: false,
      statusString: "CREATED",
      statusCode: 201,
      message: "New item is created."
    },
    400: {
      error: true,
      statusString: "BAD_REQUEST",
      statusCode: 400,
      message: "The request does not conform with the expected schema."
    },
    401: {
      error: true,
      statusString: "UNAUTHORIZED",
      statusCode: 401,
      message: "This user is not authorized to perform this action."
    },
    404: {
      error: true,
      statusString: "NOT_FOUND",
      statusCode: 404,
      message: "Could not find the requested resource."
    },
    409: {
      error: true,
      statusString: "CONFLICT",
      statusCode: 409,
      message: "This resource already exists in the system."
    },
    500: {
      error: true,
      statusString: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: "Oops, Something went wrong!"
    }
  }
};

export default ResponseConstants;
