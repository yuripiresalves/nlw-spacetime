import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

import NlwLogo from "../src/assets/nlw-spacetime-logo.svg";
import { api } from "../src/lib/api";

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/b002fb322d99a421d70f",
};

export default function App() {
  const router = useRouter();

  const [, response, signInWithGitHub] = useAuthRequest(
    {
      clientId: "b002fb322d99a421d70f",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime",
      }),
    },
    discovery
  );

  async function handleGithubOAuthCode(code: string) {
    try {
      const response = await api.post("/register", {
        code,
      });
      console.log("oiiii", response);

      const { token } = response.data;

      console.log(token);

      await SecureStore.setItemAsync("token", token);

      router.push("/memories");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // console.log(
    //   makeRedirectUri({
    //     scheme: "nlwspacetime",
    //   })
    // );

    if (response?.type === "success") {
      const { code } = response.params;

      handleGithubOAuthCode(code);
    }
  }, [response]);

  return (
    <View className="flex-1 px-12 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NlwLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGitHub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            CADASTRAR LEMBRANÇA
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  );
}
