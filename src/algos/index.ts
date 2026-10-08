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
import * as auntie from './auntie'
import * as bitch from './bitch'
import * as queen  from './queen'
import * as unc  from './unc'

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
  [auntie.shortname]: auntie.handler,
  [bitch.shortname]: bitch.handler,
  [queen.shortname]: queen.handler,
  [unc.shortname]: unc.handler,
}

export default algos
