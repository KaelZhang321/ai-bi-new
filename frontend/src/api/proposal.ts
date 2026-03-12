import client, { type ApiResponse } from './client'

export interface ProposalRow {
  region: string
  proposal_type: string
  target_count: number
  achieved_count: number
}

export interface ProposalCrossRow {
  region: string
  proposals: Record<string, number>
}

export const fetchProposalOverview = () =>
  client.get<ApiResponse<ProposalRow[]>>('/v1/proposal/overview').then(r => r.data.data)

export const fetchProposalCrossTable = () =>
  client.get<ApiResponse<ProposalCrossRow[]>>('/v1/proposal/cross-table').then(r => r.data.data)
