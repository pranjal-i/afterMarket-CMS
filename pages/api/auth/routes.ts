import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";


export default async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        let payloadToken: string | null = null;
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }


        const decoded = jwt.decode(token, { complete: true });
        if (!decoded || !(decoded as jwt.JwtPayload)?.payload?.email) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        // Call Payload CMS API to fetch user data
        const payloadApiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users?where[email][equals]=${(decoded as jwt.JwtPayload)?.email}`;

        const response = await fetch(payloadApiUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token for authentication
                'Content-Type': 'application/json',
            },
        });


        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch user data" });
        }

        const data = await response.json();
        if (!data?.docs?.length) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const user = data.docs[0];
        const currentTimestamp = Math.floor(Date.now() / 1000);

        // Generate a JWT token
        payloadToken = jwt.sign(
            {
                id: user?.id,
                email: user?.email,
                collection: 'users',
                iat: currentTimestamp,
            },
            process.env.PAYLOAD_SECRET, // Using the same secret as Payload CMS.
            { expiresIn: '4h' } // Adjusting token expiration to 4 hrs.
        );

        return res.status(200).json({ "access-token": payloadToken });

    }
    catch (error) {
        const status = error === "Unauthorized" ? 401 : 500;
        return res.status(status).json({ error });
    }
}


