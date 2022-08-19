export const mapperModelToResponse = {
  scheduledPerformanceId: 'id',
  streamId: 'stream_id',
  status: 'status',
  schedulingAccount: 'scheduling_account',
  performanceName: 'performance_name',
  genre: 'genre',
  startDatetime: 'start_datetime',
  runtime: 'runtime',
  targetArtistAccount: 'target_artist_account',
  superAdmins: 'super_admins',
  updatedFromLastEmail: 'updated_from_last_email',
  description: 'description'
};

export const mapperRequestToModel = {
  id: 'scheduledPerformanceId',
  stream_id: 'streamId',
  status: 'status',
  scheduling_account: 'schedulingAccount',
  performance_name: 'performanceName',
  genre: 'genre',
  start_datetime: 'startDatetime',
  runtime: 'runtime',
  target_artist_account: 'targetArtistAccount',
  super_admins: 'superAdmins',
  updated_from_last_email: 'updatedFromLastEmail',
  description: 'description'
};

export const mapperSearchRequestToModel = {
  status: 'status',
  startDatetime: 'start_datetime',
  performanceName: 'performance_name',
  genre: 'genre',
  scheduledPerformanceId: 'scheduled_performance_id'
};
