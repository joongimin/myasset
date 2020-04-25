lock '~> 3.13.0'

set :application, 'myasset'
set :repo_url, 'git@github.com:joongimin/myasset.git'
set :deploy_to, "/home/ubuntu/#{fetch(:application)}"
set :linked_dirs, %w[log]

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

namespace :nginx do
  task :setup do
    on roles(:app) do
      template = File.read('config/deploy/templates/myasset-nginx.conf.erb')
      text = ERB.new(template).result(binding)
      remote_path = "#{current_path}/config/myasset-nginx.conf"
      upload! StringIO.new(text), remote_path
      execute(
        :sudo, :ln,
        '-fs', remote_path, '/etc/nginx/sites-enabled/myasset-nginx.conf'
      )
    end
  end

  task :reload do
    on roles(:app) do
      execute :sudo, '/etc/init.d/nginx', 'reload'
    end
  end
end
after 'deploy:finished', 'nginx:setup'
after 'nginx:setup', 'nginx:reload'
