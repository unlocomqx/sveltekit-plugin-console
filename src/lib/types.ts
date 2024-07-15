export interface Options {
	ssr?: boolean;
}

export interface Context {
	code: string;
	id: string;
	options?: Options;
}