// src/server/auth/cached-session.ts
import { cache } from 'react';
import { getSessionUser } from './session';

export const getCachedSessionUser = cache(getSessionUser);
