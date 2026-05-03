import { z } from 'zod';

import { INTERNAL_SECRET_KEY } from '$env/static/private';


const envSchema = z.object({
    INTERNAL_SECRET_KEY: z.string().min(1),
});


const parsedEnv = envSchema.safeParse({
    INTERNAL_SECRET_KEY,
});


if ( !parsedEnv.success ) {
    console.error(
        '❌ Invalid environment variables:'
    );

    throw new Error( 'Invalid environment variables' );
}


export const ENV = {
    INTERNAL_SECRET_KEY: parsedEnv.data.INTERNAL_SECRET_KEY,
};
