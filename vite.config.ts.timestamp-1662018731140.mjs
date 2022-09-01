// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import path from "path";
var __vite_injected_original_dirname = "/Users/wenzhe/Documents/github/react-virtual-list";
var vite_config_default = defineConfig(({ mode }) => {
  if (mode === "example") {
    return {
      define: { "process.env.NODE_ENV": '"production"' },
      plugins: [react()]
    };
  }
  return {
    plugins: [dts({
      exclude: "./src/predictWorker.ts"
    }), react()],
    build: {
      lib: {
        entry: path.resolve(__vite_injected_original_dirname, "src/index.tsx"),
        name: "react-predict-virtual",
        fileName: "index",
        formats: ["es"]
      },
      rollupOptions: {
        input: {
          index: resolve(__vite_injected_original_dirname, "src/index.tsx"),
          worker: resolve(__vite_injected_original_dirname, "src/predictWorker.ts")
        },
        output: [
          {
            format: "esm",
            dir: resolve(__vite_injected_original_dirname, "dist")
          }
        ],
        external: ["react", "react-dom"]
      }
    },
    test: {
      globals: true,
      environment: "jsdom",
      coverage: {
        reporter: ["html"]
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2VuemhlL0RvY3VtZW50cy9naXRodWIvcmVhY3QtdmlydHVhbC1saXN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2VuemhlL0RvY3VtZW50cy9naXRodWIvcmVhY3QtdmlydHVhbC1saXN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93ZW56aGUvRG9jdW1lbnRzL2dpdGh1Yi9yZWFjdC12aXJ0dWFsLWxpc3Qvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgaWYgKG1vZGUgPT09ICdleGFtcGxlJykge1xuICAgIHJldHVybiB7XG4gICAgICBkZWZpbmU6IHsgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogJ1wicHJvZHVjdGlvblwiJyB9LFxuICAgICAgcGx1Z2luczogW3JlYWN0KCldXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbZHRzKHtcbiAgICAgIGV4Y2x1ZGU6ICcuL3NyYy9wcmVkaWN0V29ya2VyLnRzJ1xuICAgIH0pLCByZWFjdCgpXSxcbiAgICBidWlsZDoge1xuICAgICAgbGliOiB7XG4gICAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2luZGV4LnRzeCcpLFxuICAgICAgICBuYW1lOiAncmVhY3QtZmxvdy1saXN0JyxcbiAgICAgICAgZmlsZU5hbWU6ICdpbmRleCcsXG4gICAgICAgIGZvcm1hdHM6IFsnZXMnXVxuICAgICAgfSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgaW5wdXQ6IHtcbiAgICAgICAgICBpbmRleDogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHN4JyksXG4gICAgICAgICAgd29ya2VyOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wcmVkaWN0V29ya2VyLnRzJylcbiAgICAgICAgfSxcbiAgICAgICAgb3V0cHV0OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZm9ybWF0OiAnZXNtJyxcbiAgICAgICAgICAgIGRpcjogcmVzb2x2ZShfX2Rpcm5hbWUsICdkaXN0JylcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBleHRlcm5hbDogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgIH1cbiAgICB9LFxuICAgIHRlc3Q6IHtcbiAgICAgIGdsb2JhbHM6IHRydWUsXG4gICAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICAgIGNvdmVyYWdlOiB7XG4gICAgICAgIHJlcG9ydGVyOiBbJ2h0bWwnXSxcbiAgICAgIH0sXG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sVUFBVTtBQUxqQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxNQUFJLFNBQVMsV0FBVztBQUN0QixXQUFPO0FBQUEsTUFDTCxRQUFRLEVBQUUsd0JBQXdCLGVBQWU7QUFBQSxNQUNqRCxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsSUFDbkI7QUFBQSxFQUNGO0FBRUEsU0FBTztBQUFBLElBQ0wsU0FBUyxDQUFDLElBQUk7QUFBQSxNQUNaLFNBQVM7QUFBQSxJQUNYLENBQUMsR0FBRyxNQUFNLENBQUM7QUFBQSxJQUNYLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxRQUNILE9BQU8sS0FBSyxRQUFRLGtDQUFXLGVBQWU7QUFBQSxRQUM5QyxNQUFNO0FBQUEsUUFDTixVQUFVO0FBQUEsUUFDVixTQUFTLENBQUMsSUFBSTtBQUFBLE1BQ2hCO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDYixPQUFPO0FBQUEsVUFDTCxPQUFPLFFBQVEsa0NBQVcsZUFBZTtBQUFBLFVBQ3pDLFFBQVEsUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxRQUNuRDtBQUFBLFFBQ0EsUUFBUTtBQUFBLFVBQ047QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLEtBQUssUUFBUSxrQ0FBVyxNQUFNO0FBQUEsVUFDaEM7QUFBQSxRQUNGO0FBQUEsUUFDQSxVQUFVLENBQUMsU0FBUyxXQUFXO0FBQUEsTUFDakM7QUFBQSxJQUNGO0FBQUEsSUFDQSxNQUFNO0FBQUEsTUFDSixTQUFTO0FBQUEsTUFDVCxhQUFhO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUixVQUFVLENBQUMsTUFBTTtBQUFBLE1BQ25CO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
