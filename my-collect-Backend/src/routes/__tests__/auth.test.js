import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' }); 
import request from 'supertest';
import mongoose from 'mongoose';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../index'


describe("Auth routes", () => {
    beforeAll(async () => {
      // 2) Connexion à MongoDB TEST
      await mongoose.connect(process.env.MONGO_URI_TEST);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("should return 201 on successful register", async () => {
        const res = await request(app)
        .post("/api/auth/register")
        .send({
            username: "testuser",
            email: "testuer@exemple.com",
            password: "Strongpass123!"
        });
console.log("Response body:", res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token')
        expect(res.body.user).toHaveProperty('username', 'testuser');
    });
});