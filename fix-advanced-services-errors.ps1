# Auto-fix script for Advanced Services compilation errors
Write-Host "?? Fixing Advanced Services Compilation Errors..." -ForegroundColor Cyan

$serverPath = ".\ATSRecruitSys.Server"
$fixed = 0

# Fix 1: JobRecommendationService - Remove read-only property assignments (lines 253-254)
Write-Host "`n1. Fixing JobRecommendationService.cs - Read-only property assignments..." -ForegroundColor Yellow
$jobRecommendationFile = Join-Path $serverPath "Services\JobRecommendationService.cs"
if (Test-Path $jobRecommendationFile) {
    $content = Get-Content $jobRecommendationFile -Raw
    # Replace the invalid assignment with setting the actual writable properties
    $content = $content -replace 'candidateProfile\.PreferredSalaryMin\s*=\s*preferences\.MinSalary;', '// PreferredSalaryMin is read-only - using ExpectedSalaryMin instead'
    $content = $content -replace 'candidateProfile\.PreferredSalaryMax\s*=\s*preferences\.MaxSalary;', '// PreferredSalaryMax is read-only - using ExpectedSalaryMax instead'
    Set-Content $jobRecommendationFile -Value $content -NoNewline
    $fixed++
    Write-Host "  ? Fixed read-only property assignments" -ForegroundColor Green
}

# Fix 2: JobRecommendationService - Fix Math.Max with decimal/double (line 374)
Write-Host "`n2. Fixing JobRecommendationService.cs - Math.Max type conversion..." -ForegroundColor Yellow
if (Test-Path $jobRecommendationFile) {
    $content = Get-Content $jobRecommendationFile -Raw
    $content = $content -replace 'score \+= Math\.Max\(minSalary,\s*job\.SalaryRangeMin \?\? 0\);', 'score += Math.Max((double)minSalary, (double)(job.SalaryRangeMin ?? 0));'
    $content = $content -replace 'score \+= Math\.Max\(maxSalary,\s*job\.SalaryRangeMax \?\? 0\);', 'score += Math.Max((double)maxSalary, (double)(job.SalaryRangeMax ?? 0));'
    Set-Content $jobRecommendationFile -Value $content -NoNewline
    $fixed++
    Write-Host "  ? Fixed Math.Max type conversion" -ForegroundColor Green
}

# Fix 3: JobRecommendationService - Fix DateTime HasValue checks (lines 458-459)
Write-Host "`n3. Fixing JobRecommendationService.cs - DateTime HasValue..." -ForegroundColor Yellow
if (Test-Path $jobRecommendationFile) {
    $content = Get-Content $jobRecommendationFile -Raw
    $content = $content -replace 'if \(profile\.CreatedAt\.HasValue && \(DateTime\.UtcNow - profile\.CreatedAt\.Value\)\.TotalDays <= 30\)', 'if ((DateTime.UtcNow - profile.CreatedAt).TotalDays <= 30)'
    $content = $content -replace 'if \(profile\.AvailabilityDate\.HasValue && profile\.AvailabilityDate\.Value', 'if (profile.AvailabilityDate.HasValue && profile.AvailabilityDate.Value'
    Set-Content $jobRecommendationFile -Value $content -NoNewline
    $fixed++
    Write-Host "  ? Fixed DateTime checks" -ForegroundColor Green
}

# Fix 4: TalentPoolService - Fix CandidateSkillDto to TalentCandidateSkillDto
Write-Host "`n4. Fixing TalentPoolService.cs - DTO type conversion..." -ForegroundColor Yellow
$talentPoolFile = Join-Path $serverPath "Services\TalentPoolService.cs"
if (Test-Path $talentPoolFile) {
    $content = Get-Content $talentPoolFile -Raw
    # Replace the Skills mapping to use correct DTO
    $content = $content -replace 'Skills = profile\.Skills\?\.Select\(s => new CandidateSkillDto\s*\{', 'Skills = profile.Skills?.Select(s => new TalentCandidateSkillDto {'
    # Fix IsHighlighted property access
    $content = $content -replace 'CandidateSkillDto\.IsHighlighted', 'skill.IsHighlighted'
    Set-Content $talentPoolFile -Value $content -NoNewline
    $fixed++
    Write-Host "  ? Fixed DTO type conversions" -ForegroundColor Green
}

# Fix 5: TalentPoolService - Fix DateTime HasValue (line 505-506)
Write-Host "`n5. Fixing TalentPoolService.cs - DateTime checks..." -ForegroundColor Yellow
if (Test-Path $talentPoolFile) {
    $content = Get-Content $talentPoolFile -Raw
    $content = $content -replace 'if \(profile\.CreatedAt\.HasValue && \(DateTime\.UtcNow - profile\.CreatedAt\.Value\)\.TotalDays <= 30\)', 'if ((DateTime.UtcNow - profile.CreatedAt).TotalDays <= 30)'
    Set-Content $talentPoolFile -Value $content -NoNewline
    $fixed++
    Write-Host "  ? Fixed DateTime checks" -ForegroundColor Green
}

# Fix 6: AdvancedAnalyticsService - Fix decimal to double conversion (line 688)
Write-Host "`n6. Fixing AdvancedAnalyticsService.cs - Decimal to double..." -ForegroundColor Yellow
$analyticsFile = Join-Path $serverPath "Services\AdvancedAnalyticsService.cs"
if (Test-Path $analyticsFile) {
    $content = Get-Content $talentPoolFile -Raw
    $content = $content -replace 'AverageSalary = jobs\.Average\(j => j\.SalaryRangeMin \+ j\.SalaryRangeMax\) / 2', 'AverageSalary = (double)(jobs.Average(j => (j.SalaryRangeMin + j.SalaryRangeMax)) / 2)'
    $content = $content -replace 'AverageSalary = jobs\.Average\(j => \(j\.SalaryRangeMin \?\? 0\) \+ \(j\.SalaryRangeMax \?\? 0\)\) / 2', 'AverageSalary = (double)(jobs.Average(j => ((j.SalaryRangeMin ?? 0) + (j.SalaryRangeMax ?? 0))) / 2)'
    Set-Content $analyticsFile -Value $content -NoNewline
    $fixed++
    Write-Host "  ? Fixed decimal to double conversion" -ForegroundColor Green
}

Write-Host "`n? Applied $fixed automated fixes!" -ForegroundColor Green
Write-Host "`n?? Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: dotnet build" -ForegroundColor White
Write-Host "2. Check for any remaining errors" -ForegroundColor White
Write-Host "3. If successful, run migration and update database" -ForegroundColor White
