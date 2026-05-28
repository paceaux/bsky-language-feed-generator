import { AppContext } from '../config';
import {
  QueryParams,
  OutputSchema as AlgoOutput,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton';

import * as dude from './dude'
import * as bro from './bro'
import * as bruh from './bruh'
import * as chat from './chat'
import * as fam from './fam'
import * as sis from './sis'
import * as boi from './boi'
import * as gurl from './gurl'

type AlgoHandler = (ctx: AppContext, params: QueryParams) => Promise<AlgoOutput>

const algos: Record<string, AlgoHandler> = {
  [dude.shortname]: dude.handler,
  [bro.shortname]: bro.handler,
  [bruh.shortname]: bruh.handler,
  [chat.shortname]: chat.handler,
  [fam.shortname]: fam.handler,
  [sis.shortname]: sis.handler,
  [boi.shortname]: boi.handler,
  [gurl.shortname]: gurl.handler,
}

export default algos
