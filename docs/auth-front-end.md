# Testing by sending auth

The refresh token controller starts throwing unauthorized when the same site and secure options are set.

The refresh token problem will depend on what you are testing with. ThunderClient will not work with secure:true. Postman will, but you must know how to send the cookie with it. Testing from a frontend app with Axios requires the option withCredentials: true.
