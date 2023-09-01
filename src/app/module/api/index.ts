import { provideClient } from './api.service';
import { provideToken } from './token.service';

export const API_PROVIDER = [provideToken(), provideClient()];
