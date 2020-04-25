lock '~> 3.13.0'

set :application, 'myasset'
set :repo_url, 'git@github.com:joongimin/myasset.git'
set :deploy_to, "/home/ubuntu/#{fetch(:application)}"

namespace :client do
  DIST_FILE = 'dist.tar.gz'.freeze

  task :build do
    run_locally do
      within 'myasset-client' do
        execute :npm, 'run', 'build'
        execute :tar, '-czf', "#{DIST_FILE} -Cdist ."
      end
    end
  end

  task :deploy do
    on roles(:app) do
      within current_path do
        upload! "myasset-client/#{DIST_FILE}", DIST_FILE
        execute :mkdir, '-p', 'public'
        execute :tar, '-xzf', DIST_FILE, '-Cpublic'
        execute :rm, DIST_FILE
      end
    end
  end
end
after 'deploy:published', 'client:build'
after 'client:build', 'client:deploy'
