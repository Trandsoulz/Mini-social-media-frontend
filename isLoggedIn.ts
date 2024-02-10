"use client"

import { hasCookie } from "cookies-next";

export const isLoggedIn = hasCookie("x-auth-token");
