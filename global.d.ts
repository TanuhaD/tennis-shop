declare module "daisyui" {
	// ✅ ВИПРАВЛЕНО: Замінили 'any' на 'object', щоб задовольнити '@typescript-eslint/no-explicit-any'
	const daisyui: object;
	export default daisyui;
}
