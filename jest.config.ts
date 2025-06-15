import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '@pages': '<rootDir>/src/pages',
    '@components': '<rootDir>/src/components',
    '@ui': '<rootDir>/src/components/ui',
    '@ui-pages': '<rootDir>/src/components/ui/pages',
    '@utils-types': '<rootDir>/src/utils/types',
    '@api': '<rootDir>/src/utils/burger-api.ts',
    '@slices': '<rootDir>/src/services/slices',
    '@selectors': 's<rootDir>/rc/services/selectors'
  },
  collectCoverage: true,
  coverageProvider: 'v8',
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}]
  }
};

export default config;
