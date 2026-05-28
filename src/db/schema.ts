export type DatabaseSchema = {
  post: Post
  sub_state: SubState
}

export type Post = {
  uri: string
  url: string
  cid: string
  indexedAt: string
  text: string
  pronoun: string
  pronounPlacement: string
  surroundingWords: string
}

export type SubState = {
  service: string
  cursor: number
}
