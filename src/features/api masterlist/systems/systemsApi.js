import { api } from "../../index";

const tags = ["Systems"];

export const systemsApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getSystems: builder.query({
      query: (params) => ({
        url: "ExternalHelpdesk",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getActiveSystems: builder.query({
      query: (params) => ({
        url: "ExternalHelpdesk?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    addEditSystems: builder.mutation({
      query: (body) => ({
        url: "ExternalHelpdesk",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveSystems: builder.mutation({
      query: (id) => ({
        url: `ExternalHelpdesk/status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetSystemsQuery, useLazyGetActiveSystemsQuery, useAddEditSystemsMutation, useArchiveSystemsMutation } = systemsApi;
