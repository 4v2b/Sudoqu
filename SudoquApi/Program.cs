using Serilog;
using Serilog.Events;
using SudoquApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<SudokuService>();
builder.Services.AddSingleton<IShuffleService, FisherYatesShuffle>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var origins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()!;

builder.Services.AddCors(options => options.AddPolicy(
    "LocalDevelopement", 
    policy => policy.WithOrigins(origins)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
    )
);

builder.Services.AddControllers();

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .WriteTo.Console()
    .WriteTo.File("log-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 7)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithThreadId()
    .CreateLogger();

builder.Host.UseSerilog();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("LocalDevelopement");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseHttpsRedirection();

app.Run();
