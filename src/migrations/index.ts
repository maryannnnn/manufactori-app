import * as migration_20260824_121853_site_categories from './20260824_121853_site_categories'
import * as migration_20260825_case_study_categories from './20260825_case_study_categories'
import * as migration_20260825_posts_site_categories from './20260825_posts_site_categories'
import * as migration_20260825_case_studies from './20260825_case_studies'

export const migrations = [
  {
    up: migration_20260824_121853_site_categories.up,
    down: migration_20260824_121853_site_categories.down,
    name: '20260824_121853_site_categories',
  },
  {
    up: migration_20260825_case_study_categories.up,
    down: migration_20260825_case_study_categories.down,
    name: '20260825_case_study_categories',
  },
  {
    up: migration_20260825_posts_site_categories.up,
    down: migration_20260825_posts_site_categories.down,
    name: '20260825_posts_site_categories',
  },
  {
    up: migration_20260825_case_studies.up,
    down: migration_20260825_case_studies.down,
    name: '20260825_case_studies',
  },
]
