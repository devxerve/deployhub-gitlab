import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

interface FortyTwoProfile {
  id: number;
  login: string;
  email: string;
  image: { link: string };
}

function FortyTwoProvider(
  options: OAuthUserConfig<FortyTwoProfile>
): OAuthConfig<FortyTwoProfile> {
  return {
	id: "42-school",
	name: "42",
	type: "oauth",
	authorization: {
	  url: "https://api.intra.42.fr/oauth/authorize",
	  params: { scope: "public" }
	},
	token: "https://api.intra.42.fr/oauth/token",
	userinfo: "https://api.intra.42.fr/v2/me",
	clientId: options.clientId,
	clientSecret: options.clientSecret,
	profile(profile: FortyTwoProfile) {
	  return {
		id: String(profile.id),
		name: profile.login,
		email: profile.email,
		image: profile.image.link
	  };
	}
  };
}

const handler = NextAuth({
  providers: [
	GitHubProvider({
	  clientId: process.env.GITHUB_ID!,
	  clientSecret: process.env.GITHUB_SECRET!
	}),
	GoogleProvider({
	  clientId: process.env.GOOGLE_ID!,
	  clientSecret: process.env.GOOGLE_SECRET!
	}),
	FortyTwoProvider({
	  clientId: process.env.FORTY_TWO_ID!,
	  clientSecret: process.env.FORTY_TWO_SECRET!
	})
  ]
});

export { handler as GET, handler as POST };